// import { GoogleTagManager } from "../monitoring/GoogleTagManager";
// import { Hotjar } from "../monitoring/Hotjar";
import type { ReactNode } from 'react';
import type { MenuProps } from '../navigation';
import { Footer } from './Footer';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

interface ApplicationProps {
	children: ReactNode;
	name: string;
	menu: MenuProps;
	logo: React.ReactNode;
	// hotjarID?: string;
	// gtmID?: string;
}

export function Application(props: ApplicationProps) {
	return (
		<div className="flex min-h-screen flex-col">
			<Header name={props.name} menu={props.menu} />
			<div className="flex flex-1">
				<Sidebar menu={props.menu} logo={props.logo} />
				<main className="flex-1">{props.children}</main>
			</div>
			<Footer />
			{/* <Hotjar hotjarID={props.hotjarID} /> */}
			{/* <GoogleTagManager gtmID={props.gtmID} /> */}
		</div>
	);
}
