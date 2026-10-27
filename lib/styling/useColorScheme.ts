import { useCallback, useSyncExternalStore } from 'react';

export type ColorScheme = 'light' | 'dark';

const STORAGE_KEY = 'goaldr-color-scheme';

const listeners = new Set<() => void>();
let current: ColorScheme | undefined;

function readInitialScheme(): ColorScheme {
	const stored = localStorage.getItem(STORAGE_KEY);
	if (stored === 'light' || stored === 'dark') return stored;
	return window.matchMedia('(prefers-color-scheme: dark)').matches
		? 'dark'
		: 'light';
}

function getScheme(): ColorScheme {
	if (!current) {
		current = readInitialScheme();
		document.documentElement.classList.toggle('dark', current === 'dark');
	}
	return current;
}

function setScheme(scheme: ColorScheme) {
	current = scheme;
	localStorage.setItem(STORAGE_KEY, scheme);
	document.documentElement.classList.toggle('dark', scheme === 'dark');
	for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
	listeners.add(listener);
	return () => {
		listeners.delete(listener);
	};
}

/**
 * Provides the current color scheme and utilities to change it, by toggling the "dark" class
 * on the root element - cf. the "dark" custom variant in preset.css.
 * Defaults to the OS preference; the user's choice is persisted in the local storage.
 * Same shape as GoaldN's hook.
 */
export function useColorScheme() {
	const colorScheme = useSyncExternalStore(subscribe, getScheme);
	const toggleColorScheme = useCallback(
		() => setScheme(getScheme() === 'dark' ? 'light' : 'dark'),
		[],
	);
	return {
		colorScheme,
		isDarkColorScheme: colorScheme === 'dark',
		setColorScheme: setScheme,
		toggleColorScheme,
	};
}
