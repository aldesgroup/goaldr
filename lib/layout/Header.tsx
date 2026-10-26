import { cn } from 'cn';
import { Menu as MenuIcon, PanelLeftClose } from 'lucide-react';
import { useState } from 'react';
import { Menu, type MenuProps } from '../navigation';
import { LangMenu } from '../settings/LangMenu';
import { Button as Rawbutton } from '../ui/button';
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '../ui/sheet';
// import { LangMenu } from "../settings/LangMenu";

export function Header(props: { name: string; menu: MenuProps }) {
	const [menuOpen, setMenuOpen] = useState(false);

	return (
		<header className="bg-devotion-action text-devotion-white sm:bg-devotion-white sm:text-foreground sticky top-0 z-50 flex h-14 items-center px-4 sm:h-20 sm:border-b">
			<Sheet open={menuOpen} onOpenChange={setMenuOpen}>
				{!menuOpen ? (
					<SheetTrigger
						className="hidden sm:block"
						render={
							<Rawbutton className="shrink-0 pl-2.5" size="icon" variant="link">
								{/* <MenuIcon className="sm:text-devotion-action h-5 w-5" /> */}
								<MenuIcon />
								<span className="sr-only">Toggle navigation menu</span>
							</Rawbutton>
						}
					/>
				) : (
					<SheetClose
						className="hidden sm:block"
						render={
							<Rawbutton className="shrink-0 pl-2.5" size="icon" variant="link">
								{/* <MenuIcon className="sm:text-devotion-action h-5 w-5" /> */}
								<PanelLeftClose />
								<span className="sr-only">Toggle navigation menu</span>
							</Rawbutton>
						}
					/>
				)}
				<SheetContent side="top">
					<SheetHeader>
						<SheetTitle>
							{/* <span className="sr-only"> */}
							<span className="sm:text-devotion-action hidden w-full font-normal sm:text-center">
								{props.name}
							</span>
						</SheetTitle>
					</SheetHeader>
					<Menu
						entries={props.menu.entries}
						menuClass={cn(
							props.menu.menuClass || 'text-secondary flex flex-col gap-2 pt-4',
						)}
						entryClass={cn(
							props.menu.entryClass ||
								'flex items-center gap-3 py-2 hover:bg-devotion-background hover:rounded',
						)}
						labelClass={cn(props.menu.labelClass || 'text-md font-normal')}
						activeClass={cn(
							props.menu.activeClass ||
								'bg-devotion-grey text-devotion-action font-medium rounded',
						)}
						onEntryClick={() => setMenuOpen(false)}
					/>
				</SheetContent>
			</Sheet>

			{/* App title */}
			<span className="sm:text-devotion-action w-full sm:text-center">
				{props.name}
			</span>

			{/* Avatar */}
			<div className="flex sm:gap-1.5">
				<LangMenu />
				{/* <Avatar /> */}
			</div>
		</header>
	);
}
