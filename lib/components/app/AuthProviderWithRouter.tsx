import {
    RouterProvider,
    type AnyRoute,
    type Router,
} from "@tanstack/react-router";

import { AuthProvider, useAuth, type TAuthConfig } from "../../utils/auth";
import "../../utils/i18n";
import { getAllParentRoutes, newRouter } from "../../utils/router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { debug } from "../../utils/debug";

// Router provider that uses the AuthContext as its context, which allows auth-aware navigation
// This router also detects route changes and tries to load the translations for the new route, if not done yet.
function RouterProviderWithContext(props: {
    router: Router<any, any, any, any>;
}) {
    // we can use this if we're inside an AuthProvider
    const auth = useAuth();
    const { i18n } = useTranslation();

    useEffect(() => {
        const handleRouteChange = () => {
            debug("Route changed to:", props.router.state.location);

            i18n.loadNamespaces(
                getAllParentRoutes(props.router.state.location.pathname),
                () => {
                    i18n.changeLanguage(i18n.language); // Ensure the new namespace is loaded
                },
            );
        };

        // Listen for route changes
        props.router.subscribe("onBeforeLoad", handleRouteChange);
    }, [props.router]);

    return <RouterProvider router={props.router} context={{ auth }} />;
}

const lskey_GOTOAFTERLOGIN = "goToAfterLogin";

/**
 * A component that handles authentication, routing, and i18n
 */
export function AuthProviderWithRouter(props: {
    routeTree: AnyRoute;
    clientID: string;
    loginURL: string;
    tokenURL: string;
    logoutURL: string;
}) {
    // building the auth config with hard-coded defaults (for now)
    const authConfig: TAuthConfig = {
        autoLogin: false,
        storageKeyPrefix: "auth_",
        clientId: props.clientID.trim(),
        authorizationEndpoint: props.loginURL.trim(),
        redirectUri: window.location.origin,
        tokenEndpoint: props.tokenURL.trim(),
        logoutEndpoint: props.logoutURL.trim(),
        logoutRedirect: window.location.origin,
        // making sure
        preLogin: () =>
            localStorage.setItem(
                lskey_GOTOAFTERLOGIN,
                window.location.pathname,
            ),
        postLogin: () =>
            window.location.replace(
                localStorage.getItem(lskey_GOTOAFTERLOGIN) || "",
            ),
    };

    // returning the configured auth provider, wrapping our configured router
    return (
        <AuthProvider authConfig={authConfig}>
            <RouterProviderWithContext router={newRouter(props.routeTree)} />
        </AuthProvider>
    );
}
