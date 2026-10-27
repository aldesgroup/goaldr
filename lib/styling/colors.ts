/**
 * Names of the colors defined by the GoaldR preset (cf. preset.css).
 * Each name is the camelCase version of a CSS variable: "primaryForeground" <=> "--primary-foreground".
 */
export const goaldrColorNames = [
	'background',
	'foreground',
	'foregroundLight',
	'primary',
	'primaryLight',
	'primaryForeground',
	'secondary',
	'secondaryDarker',
	'secondaryForeground',
	'destructive',
	'destructiveDarker',
	'destructiveForeground',
	'muted',
	'mutedForeground',
	'accent',
	'accentForeground',
	'popover',
	'popoverForeground',
	'card',
	'cardForeground',
	'info',
	'infoLight',
	'infoForeground',
	'warningForeground',
	'errorForeground',
	'border',
	'input',
	'ring',
	'devotionAction',
	'devotionActionHover',
	'devotionWhite',
	'devotionBlack',
	'devotionGrey',
	'devotionGreyer',
	'devotionGreyest',
	'devotionBackground',
	'devotionPressed',
] as const;

export type ColorsOf<T extends readonly string[]> = {
	readonly [K in T[number]]: string;
};

export type GoaldrColors = ColorsOf<typeof goaldrColorNames>;

const toCssVar = (name: string) =>
	`var(--${name.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)})`;

/**
 * Builds an object giving, for each name, a `var(--the-name)` CSS value.
 * Meant for libs / apps extending the preset with their own colors (cf. emeraldr).
 */
export function createColors<const T extends readonly string[]>(
	names: T,
): ColorsOf<T> {
	return Object.fromEntries(
		names.map((name) => [name, toCssVar(name)]),
	) as ColorsOf<T>;
}

/**
 * The CSS variables are the single source of truth, so `colors.primary` is "var(--primary)".
 * That's valid wherever a CSS color is (style, SVG attributes, icon props...),
 * and follows overrides & dark mode automatically.
 */
export const colors: GoaldrColors = createColors(goaldrColorNames);

/** Same access as in the native world (GoaldN), for easier code sharing. */
export const getColors = () => colors;

/**
 * For the rare consumers that can't deal with `var(...)` (canvas, some chart libs):
 * returns the colors' current computed values, for the current theme.
 */
export function resolveColors<T extends Record<string, string>>(
	cssColors: T = colors as unknown as T,
	element: Element = document.documentElement,
): T {
	const style = getComputedStyle(element);
	return Object.fromEntries(
		Object.entries(cssColors).map(([name, cssVar]) => [
			name,
			style.getPropertyValue(cssVar.slice(4, -1)).trim(),
		]),
	) as T;
}
