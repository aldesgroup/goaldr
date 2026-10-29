import { cn } from 'cn';
import { Menu, type MenuProps } from '../navigation';

export function Sidebar(props: { menu: MenuProps; logo: React.ReactNode }) {
	return (
		<div className="w-sidebar flex-none border-r pb-10 sm:hidden">
			<div className="flex h-24 items-center px-6">{props.logo}</div>
			<Menu
				entries={props.menu.entries}
				menuClass={cn(
					props.menu.menuClass || 'text-secondary flex flex-col gap-2 px-6',
				)}
				entryClass={cn(
					props.menu.entryClass ||
						'hover:bg-devotion-background flex items-center gap-3 py-2 pl-2 hover:rounded',
				)}
				labelClass={cn(props.menu.labelClass || 'text-md font-normal')}
				activeClass={cn(
					props.menu.activeClass ||
						'bg-devotion-grey text-devotion-action rounded font-medium',
				)}
			/>
		</div>
	);
}
