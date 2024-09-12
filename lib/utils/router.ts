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
        defaultPreload: false, // this causes issues with auth-protected routes
    });
}

// Utils
const routeHierarchies: { [key: string]: string[] } = {};

export function getAllParentRoutes(route: string): string[] {
    // Check if the result is already cached
    if (routeHierarchies[route]) {
        return routeHierarchies[route];
    }

    // Base case: If the route is "/"
    if (route === "/" || route === "") {
        return ["/"];
    }

    // Store the current route
    const parentRoutes: string[] = [route];

    // Remove the last segment to get the parent route
    const parentRoute = route.substring(0, route.lastIndexOf("/")) || "/";

    // Adding the parent route's parent routes
    parentRoutes.push(...getAllParentRoutes(parentRoute));

    // Cache the result for the current route
    routeHierarchies[route] = parentRoutes;

    return parentRoutes;
}
