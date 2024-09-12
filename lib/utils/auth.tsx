import * as React from "react";
import { AuthContext, IAuthContext } from "react-oauth2-code-pkce";
// import { createRoute, AnyRoute } from "@tanstack/react-router";
// import { z } from "zod";

// Re-exports
export { AuthProvider, AuthContext } from "react-oauth2-code-pkce";
export type { IAuthContext } from "react-oauth2-code-pkce";
export type { TAuthConfig } from "react-oauth2-code-pkce";

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
    const context = React.useContext<IAuthContext>(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}

// handling visibility depending on the auth status of the user
// eslint-disable-next-line react-refresh/only-export-components
export enum Visibility {
    Always,
    OnlyUsers,
    OnlyAdmins,
}

// generic route to dynamically add to the root route (the route tree) to handle auth-related stuff
export const AuthPath = "/auth";
// export function AuthRoute<T extends AnyRoute>(routeTree: T): AnyRoute {
//     return createRoute({
//         getParentRoute: () => routeTree,
//         path: AuthPath,
//         validateSearch: z.object({
//             code: z.string().optional(),
//         }),
//         beforeLoad: ({ search }) => {
//             debug(search.code);
//         },
//     });
// }
