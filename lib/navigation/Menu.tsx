import { Link } from '@tanstack/react-router';
import type { LucideIcon } from 'lucide-react';
import { Visibility } from '../auth';
import { Label } from '../base';

interface menuEntry {
	Break: boolean;
	Route: string;
	Icon: LucideIcon | undefined;
	Label: string;
	Prefix: string;
	Visibility: Visibility;
}

export function AddBreak(): menuEntry {
	return {
		Break: true,
		Route: '',
		Icon: undefined,
		Label: '',
		Prefix: '',
		Visibility: Visibility.Always,
	};
}

export function AddEntry(
	route: string,
	icon: LucideIcon,
	label: string,
	prefix?: string,
	visibility?: Visibility,
): menuEntry {
	return {
		Break: false,
		Route: route,
		Icon: icon,
		Label: label,
		Prefix: prefix || '',
		Visibility: visibility || Visibility.Always,
	};
}

export interface MenuProps {
	entries: menuEntry[];
	menuClass?: string;
	entryClass?: string;
	labelClass?: string | undefined;
	activeClass?: string;
	onEntryClick?: () => void;
}

export function Menu(props: MenuProps) {
	// const auth = useAuth();
	const auth = {
		idToken: null,
	};
	const entries = props.entries.filter((entry, index) => {
		// not allowing starting & trailing breaks, nor successive ones
		if (entry.Break) {
			return (
				index > 0 &&
				index < props.entries.length - 1 &&
				!props.entries[index - 1]?.Break
			);
		} else {
			// for real menu entries, visibility depends on the chosen mode and the user's auth state
			return (
				entry.Visibility === Visibility.Always ||
				(entry.Visibility === Visibility.OnlyUsers && auth.idToken) ||
				(entry.Visibility === Visibility.OnlyAdmins && auth.idToken)
			);
		}
	});

	return (
		<nav className={props.menuClass}>
			{entries.map((entry, index) => {
				if (entry.Break) {
					if (
						// not allowing starting & trailing breaks, nor successive ones
						index > 0 &&
						index < entries.length - 1 &&
						!entries[index - 1]?.Break
					) {
						// biome-ignore lint: missing key for <hr>
						return <hr key={index} />;
					} else {
						return null;
					}
				} else {
					return (
						<Link
							to={entry.Route}
							className={props.entryClass}
							activeProps={{ className: props.activeClass }}
							// biome-ignore lint: missing key for <p>
							key={index}
							onClick={() => {
								props.onEntryClick?.();
							}}
						>
							{entry.Icon && <entry.Icon className="size-5" />}
							{entry.Prefix && <span>{entry.Prefix}</span>}
							<Label value={entry.Label} className={props.labelClass} />
						</Link>
					);
				}
			})}
		</nav>
	);
}
