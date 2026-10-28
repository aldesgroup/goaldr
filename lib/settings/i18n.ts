import { useLocation } from '@tanstack/react-router';
import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpBackend from 'i18next-http-backend';
import { initReactI18next, useTranslation } from 'react-i18next';
// import { debug, isDebug } from "./debug";
import { getAllParentRoutes } from '../navigation';
import type { GoaldrConfig } from './config';

let initPromise: Promise<unknown> = Promise.resolve();

// i18n module initialising
export const initI18n = (config: GoaldrConfig) => {
	initPromise = i18n
		.use(HttpBackend)
		.use(LanguageDetector) // Detect the user's language automatically
		.use(initReactI18next)
		.init({
			backend: {
				loadPath: `${config.ApiURL}/rest/translation/{{lng}}?Namespace={{ns}}`,

				parse: (data: string) => {
					const jsonObject = JSON.parse(data) as {
						objectList: { key: string; value: string }[];
					};

					return jsonObject.objectList.reduce<Record<string, string>>(
						(acc, { key, value }) => {
							acc[key] = value;
							return acc;
						},
						{},
					);
				},
			},
			ns: getAllParentRoutes(window.location.pathname), // making sure we load the needed namespaces right away
			detection: {
				order: [
					'querystring',
					'cookie',
					'localStorage',
					'navigator',
					'htmlTag',
				],
				lookupFromPathIndex: 0, // Detect language from the first part of the URL path (e.g., /en-US/ => 'en')
				caches: ['cookie'], // Cache user language in cookies
			},
			fallbackLng: false,
			interpolation: {
				escapeValue: false,
			},
			load: 'languageOnly', // Only load the base language (ignore region codes like 'US' in 'en-US')
			react: {
				useSuspense: false,
			},
		});

	return initPromise;
};

/**
 * Truncates a label to a specified maximum length, cutting at a space if possible.
 * @param {string} label - The label to truncate.
 * @param {number} max - The maximum length of the label.
 * @returns {string} The truncated label.
 * @category Settings
 */
function keyFromLabel(label: string, max: number) {
	// If the string is already within the max length, return it as is
	if (label.length <= max) {
		return label;
	}

	// Finding the place where to cut the string, starting from the end
	let cutIndex = 0;
	for (let i = max; i > 0; i--) {
		if (label[i] === ' ') {
			cutIndex = i;
			break;
		}
	}

	// If no space is found, cut at the maximum size
	if (cutIndex === 0) {
		cutIndex = max;
	}

	// Return the substring up to the cut index
	return label.slice(0, cutIndex);
}

/**
 * Makes sure the namespaces needed by a route (and its parents) are loaded.
 * To be awaited from a router `beforeLoad`, so the route only renders once its translations are available.
 */
export const loadRouteNamespaces = async (pathname: string) => {
	await initPromise;
	await i18n.loadNamespaces(getAllParentRoutes(pathname));
};

// Helper function to recursively check parent routes for a translation
const useTranslateKeyAtRoute = () => {
	const { t, i18n } = useTranslation();

	return (label: string, route: string) => {
		// We do not translate english since we're coding in english
		if (i18n.language?.startsWith('en')) {
			return { translation: label, missing: false };
		}

		// Attempt to translate using the current path as the namespace
		let translation = '';

		// Making a key from the label
		const key = keyFromLabel(label, 48); // TODO! Env var to set here, driven by Aldev

		// Iterate through all parent routes to find a translation for the key
		for (const parentRoute of getAllParentRoutes(route)) {
			translation = t(key, { ns: parentRoute, defaultValue: '' });
			if (translation !== '') {
				break;
			}
		}

		return { translation, missing: translation === '' };
	};
};

// main translating function hook

/**
 * @returns a translation function that returns the translation found for the current language and route,
 * else it returns the provided key
 */
export const useTranslator = () => {
	const currentLocation = useLocation();
	const translateKeyAtRoute = useTranslateKeyAtRoute();

	const translate = (label: string) => {
		const { translation, missing } = translateKeyAtRoute(
			label,
			currentLocation.pathname,
		);

		return { translation, missing };
	};

	return { translate };
};
