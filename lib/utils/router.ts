import type { AnyRoute, Router } from "@tanstack/react-router";
import { createRouter } from "@tanstack/react-router";

type TrailingSlashOption = "always" | "never" | "preserve";

export function newRouter<
    TRouteTree extends AnyRoute,
    TTrailingSlashOption extends TrailingSlashOption,
    TDehydrated extends Record<string, unknown> = Record<string, unknown>,
    TSerializedError extends Record<string, unknown> = Record<string, unknown>,
>(
    routeTree: TRouteTree,
): Router<TRouteTree, TTrailingSlashOption, TDehydrated, TSerializedError> {
    return createRouter({
        routeTree,
        context: {
            auth: undefined!, // This will be set after we wrap the app in an AuthProvider
        },
        defaultPreload: "intent",
    });
}
