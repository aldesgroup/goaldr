// import { useState } from "react";
// import {
//     DropdownMenu,
//     DropdownMenuContent,
//     DropdownMenuItem,
//     DropdownMenuTrigger,
//     Rawbutton,
// } from "~/../../../../open/goaldr/lib" /* ___HOTSWAPPED___ do not commit! */;
// import { useTranslation } from "react-i18next";

// // const languages = (import.meta.env.WEB_LANGUAGES.trim() as string).split(",");

// export function LangMenu() {
//     const [languageOpen, setLanguageOpen] = useState(false);
//     const { i18n } = useTranslation();

//     const handleLanguageChange = (code: string) => {
//         i18n.changeLanguage(code);
//     };

//     return (
//         <DropdownMenu open={languageOpen} onOpenChange={setLanguageOpen}>
//             <DropdownMenuTrigger asChild className="">
//                 <Rawbutton className="bg-devotion-action sm:bg-devotion-white hover:bg-muted-foreground hover:bg-devotion-action-hover m-0 flex h-12 gap-2 text-base font-bold sm:gap-1 sm:px-0">
//                     <WorldIcon className="sm:text-devotion-action size-5" />
//                     <span className="sm:text-devotion-action w-3 font-normal">
//                         {i18n.language}
//                     </span>
//                     <span className="sr-only">Changle language menu</span>
//                     {languageOpen ? (
//                         <UpIcon className="sm:text-devotion-action size-5 sm:hidden" />
//                     ) : (
//                         <DownIcon className="sm:text-devotion-action size-5 sm:hidden" />
//                     )}
//                 </Rawbutton>
//             </DropdownMenuTrigger>
//             {/* <DropdownMenuContent className="flex min-w-16 flex-col gap-1.5 py-2">
//                 {languages.map((lang) => (
//                     <DropdownMenuItem
//                         className="self-center"
//                         key={lang}
//                         onClick={() => handleLanguageChange(lang)}
//                     >
//                         {lang}
//                     </DropdownMenuItem>
//                 ))}
//             </DropdownMenuContent> */}
//         </DropdownMenu>
//     );
// }

// function DownIcon(props: React.SVGProps<SVGSVGElement>) {
//     return (
//         <svg
//             {...props}
//             xmlns="http://www.w3.org/2000/svg"
//             width="24"
//             height="24"
//             strokeWidth="2"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//             fill="none"
//         >
//             <path d="M6 9L12 15L18 9" />
//         </svg>
//     );
// }

// function UpIcon(props: React.SVGProps<SVGSVGElement>) {
//     return (
//         <svg
//             {...props}
//             xmlns="http://www.w3.org/2000/svg"
//             width="24"
//             height="24"
//             strokeWidth="2"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//             fill="none"
//         >
//             <path d="M6 15L12 9L18 15"></path>
//         </svg>
//     );
// }

// function WorldIcon(props: React.SVGProps<SVGSVGElement>) {
//     return (
//         <svg
//             {...props}
//             xmlns="http://www.w3.org/2000/svg"
//             width="24"
//             height="24"
//             strokeWidth="2"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//             fill="none"
//         >
//             <path d="M2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12Z"></path>
//             <path d="M13 2.04932C13 2.04932 16 5.99994 16 11.9999C16 17.9999 13 21.9506 13 21.9506"></path>
//             <path d="M11 21.9506C11 21.9506 8 17.9999 8 11.9999C8 5.99994 11 2.04932 11 2.04932"></path>
//             <path d="M2.62964 15.5H21.3704"></path>
//             <path d="M2.62964 8.5H21.3704"></path>
//         </svg>
//     );
// }
