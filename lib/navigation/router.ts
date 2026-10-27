// import type { AnyRoute, Router } from "@tanstack/react-router";
// import { createRouter } from "@tanstack/react-router";

// type TrailingSlashOption = "always" | "never" | "preserve";

// export function newRouter<
//     TRouteTree extends AnyRoute,
//     TTrailingSlashOption extends TrailingSlashOption,
//     TDehydrated extends Record<string, unknown> = Record<string, unknown>,
//     TSerializedError extends Record<string, unknown> = Record<string, unknown>,
// >(
//     routeTree: TRouteTree,
// ): Router<TRouteTree, TTrailingSlashOption, TDehydrated, TSerializedError> {
//     return createRouter({
//         routeTree,
//         context: {
//             auth: undefined!, // This will be set after we wrap the app in an AuthProvider
//         },
//         defaultPreload: false, // this causes issues with auth-protected routes
//     });
// }

// Utils
const routeHierarchies: { [key: string]: string[] } = {};

export function getAllParentRoutes(route: string): string[] {
	// Normalize the route by replacing each slash with an underscore
	route = route.replace(/\//g, '_');

	// Check if the result is already cached
	const cached = routeHierarchies[route];
	if (cached !== undefined) {
		return cached;
	}

	// Base case: If the route is "/"
	if (route === '_' || route === '') {
		return ['_'];
	}

	// Store the current route
	const parentRoutes: string[] = [route];

	// Remove the last segment to get the parent route
	const parentRouteRaw = route.substring(0, route.lastIndexOf('_')) || '_';

	// Replacing each slash with an underscore
	const parentRoute = parentRouteRaw.replace(/\//g, '_');

	// Adding the parent route's parent routes
	parentRoutes.push(...getAllParentRoutes(parentRoute));

	// Cache the result for the current route
	routeHierarchies[route] = parentRoutes;

	return parentRoutes;
}
