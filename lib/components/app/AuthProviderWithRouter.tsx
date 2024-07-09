import {
    type AnyRoute,
    type Router,
    RouterProvider,
} from "@tanstack/react-router";

import { AuthProvider, useAuth, type TAuthConfig } from "../../utils/auth";
import { newRouter } from "../../utils/router";

// Router provider that uses the AuthContext as its context, which allows auth-aware navigation
function RouterProviderWithContext(props: {
    router: Router<any, any, any, any>;
}) {
    // we can use this if we're inside an AuthProvider
    const auth = useAuth();
    return <RouterProvider router={props.router} context={{ auth }} />; // "context.auth" = auth
}

export const lskey_GOTOAFTERLOGIN = "goToAfterLogin";

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
        clientId: props.clientID,
        authorizationEndpoint: props.loginURL,
        redirectUri: window.location.origin,
        tokenEndpoint: props.tokenURL,
        logoutEndpoint: props.logoutURL,
        logoutRedirect: window.location.origin,
        // making sure
        postLogin: () =>
            window.location.replace(
                localStorage.getItem(lskey_GOTOAFTERLOGIN) || "",
            ),
        // other params
        // onRefreshTokenExpire: (event) =>
        //     window.confirm('Tokens have expired. Refresh page to continue using the site?') && event.logIn(),
        //   // Example to redirect back to original path after login has completed
        // decodeToken: false,
        // preLogin: () =>
        //     localStorage.setItem("preLoginPath", window.location.pathname),
    };

    // injecting an "/auth" route - doing this only once to avoid crashes
    // let routeTree = props.routeTree;
    // if (
    //     !routeTree.children.find(
    //         (child: AnyRoute) => child.fullPath === AuthPath,
    //     )
    // ) {
    //     routeTree = props.routeTree.addChildren([
    //         ...props.routeTree.children,
    //         AuthRoute(props.routeTree),
    //     ]);
    // }

    // returning the configured auth provider, wrapping our configured router
    return (
        <AuthProvider authConfig={authConfig}>
            <RouterProviderWithContext router={newRouter(props.routeTree)} />
        </AuthProvider>
    );
}
