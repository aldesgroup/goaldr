import { useLocation } from "@tanstack/react-router";
import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpBackend from "i18next-http-backend";
import { initReactI18next, useTranslation } from "react-i18next";
import { debug, isDebug } from "./debug";
import { getAllParentRoutes } from "./router";

// i18n module initialising
i18n.use(HttpBackend)
    .use(LanguageDetector) // Detect the user's language automatically
    .use(initReactI18next)
    .init({
        backend: {
            loadPath:
                import.meta.env.WEB_API_URL.trim() +
                "/rest/translation/{{lng}}?Namespace={{ns}}",

            parse: (data: string) => {
                const jsonObject = JSON.parse(data) as {
                    ObjectList: { Key: string; Value: String }[];
                };

                return jsonObject.ObjectList.reduce((acc, { Key, Value }) => {
                    // @ts-ignore
                    acc[Key] = Value;
                    return acc;
                }, {});
            },
        },
        ns: getAllParentRoutes(window.location.pathname), // making sure we load the needed namespaces right away
        detection: {
            order: [
                "querystring",
                "cookie",
                "localStorage",
                "navigator",
                "htmlTag",
            ],
            lookupFromPathIndex: 0, // Detect language from the first part of the URL path (e.g., /en-US/ => 'en')
            caches: ["cookie"], // Cache user language in cookies
        },
        fallbackLng: false,
        interpolation: {
            escapeValue: false,
        },
        load: "languageOnly", // Only load the base language (ignore region codes like 'US' in 'en-US')
        react: {
            useSuspense: false,
        },
    });

// Helper function to recursively check parent routes for a translation
const translateKeyAtRoute = (key: string, route: string) => {
    const { t, i18n } = useTranslation();

    // We do not translate english since we're coding in english
    if (i18n.language && i18n.language.startsWith("en")) {
        return { translation: key, missing: false };
    }

    // Attempt to translate using the current path as the namespace
    let translation = "";

    for (const parentRoute of getAllParentRoutes(route)) {
        translation = t(key, { ns: parentRoute, defaultValue: "" });
        if (translation !== "") {
            break;
        }
    }

    return { translation, missing: translation === "" };
};

// keeping track of the missing translations
let missingTranslations = new Map<string, boolean>();

// (re)initialising the missing translations
export function resetMissingTranslations() {
    missingTranslations = new Map<string, boolean>();
}

// showing the missing translations in debug mode
// @ts-ignore
window.showMissingTranslations = function (): void {
    if (!isDebug()) {
        console.log("Debug mode not activated, showing you nothing!");
    }

    debug(
        Array.from(missingTranslations)
            .filter(([_, value]) => value) // Only keep entries with `true` values
            .map(([key]) => key) // Extract the keys
            .join("\n"), // Join keys with a newline
    );
};

// main translating function hook

/**
 * @returns a translation function that returns the translation found for the current language and route,
 * else it returns the provided key
 */
export const useTranslator = () => {
    const currentLocation = useLocation();

    const translate = (label: string) => {
        const { translation, missing } = translateKeyAtRoute(
            label,
            currentLocation.pathname,
        );

        // keeping track of the missing translations in debug mode
        if (isDebug()) {
            missingTranslations.set(
                currentLocation.pathname + "," + label,
                translation === "",
            );
        }

        return { translation, missing };
    };

    return { translate };
};
