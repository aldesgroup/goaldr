import { ChevronDown, ChevronUp, Globe } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { getGoaldrConfig } from './config';

export function LangMenu() {
	const [languageOpen, setLanguageOpen] = useState(false);
	const { i18n } = useTranslation();
	const { Languages } = getGoaldrConfig();

	const handleLanguageChange = (code: string) => {
		i18n.changeLanguage(code);
	};

	return (
		<DropdownMenu open={languageOpen} onOpenChange={setLanguageOpen}>
			<DropdownMenuTrigger
				render={
					<Button className="bg-devotion-action sm:bg-devotion-white hover:bg-devotion-action-hover m-0 flex h-12 gap-2 text-base font-bold sm:gap-1 sm:px-0">
						<Globe className="sm:text-devotion-action size-5" />
						<span className="sm:text-devotion-action w-3 font-normal">
							{i18n.language}
						</span>
						<span className="sr-only">Changle language menu</span>
						{languageOpen ? (
							<ChevronUp className="sm:text-devotion-action size-5 sm:hidden" />
						) : (
							<ChevronDown className="sm:text-devotion-action size-5 sm:hidden" />
						)}
					</Button>
				}
			/>
			<DropdownMenuContent className="flex min-w-16 flex-col gap-1.5 py-2">
				{Languages.map((lang) => (
					<DropdownMenuItem
						className="self-center"
						key={lang}
						onClick={() => handleLanguageChange(lang)}
					>
						{lang}
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
