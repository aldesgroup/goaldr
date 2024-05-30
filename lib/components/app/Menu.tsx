import { Link } from "@tanstack/react-router";

import { useAuth, Visibility } from "../../utils/auth";

interface menuEntry {
    Break: boolean;
    Route?: string;
    Icon: (props: React.SVGProps<SVGSVGElement>) => JSX.Element;
    Label?: string;
    Visibility: Visibility;
}

export function AddBreak(): menuEntry {
    return {
        Break: true,
        Icon: () => <></>,
        Visibility: Visibility.Always,
    };
}

export function AddEntry(
    route: string,
    icon: (props: React.SVGProps<SVGSVGElement>) => JSX.Element,
    label: string,
    visibility?: Visibility,
): menuEntry {
    return {
        Break: false,
        Route: route,
        Icon: icon,
        Label: label,
        Visibility: visibility || Visibility.Always,
    };
}

export interface MenuProps {
    entries: menuEntry[];
    menuClass?: string;
    entryClass?: string;
    activeClass?: string;
}

export function Menu(props: MenuProps) {
    const auth = useAuth();
    const entries = props.entries.filter((entry, index) => {
        // not allowing starting & trailing breaks, nor successive ones
        if (entry.Break) {
            return (
                index > 0 &&
                index < props.entries.length - 1 &&
                !props.entries[index - 1].Break
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
            {entries.map(function (entry, index) {
                if (entry.Break) {
                    if (
                        // not allowing starting & trailing breaks, nor successive ones
                        index > 0 &&
                        index < entries.length - 1 &&
                        !entries[index - 1].Break
                    ) {
                        return <hr key={index} />;
                    }
                } else {
                    return (
                        <Link
                            to={entry.Route}
                            className={props.entryClass}
                            activeProps={{ className: props.activeClass }}
                            key={index}
                        >
                            <entry.Icon className="size-5" />
                            <span>{entry.Label}</span>
                        </Link>
                    );
                }
            })}
        </nav>
    );
}
