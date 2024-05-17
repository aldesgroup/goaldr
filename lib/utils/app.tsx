import {
    type AnyRoute,
    type Router,
    RouterProvider,
} from "@tanstack/react-router";

import { AuthProvider, useAuth } from "./auth";
import { newRouter } from "./router";

function RouterProviderWithContext(props: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    router: Router<any, any, any, any>;
}) {
    const auth = useAuth();
    return <RouterProvider router={props.router} context={{ auth }} />;
}

export function AuthProvidedRouter(props: { routeTree: AnyRoute }) {
    const router = newRouter(props.routeTree);
    return (
        <AuthProvider>
            <RouterProviderWithContext router={router} />
        </AuthProvider>
    );
}
