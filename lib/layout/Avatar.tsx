// import { useState } from "react";
// import {
//     DropdownMenu,
//     DropdownMenuContent,
//     DropdownMenuItem,
//     DropdownMenuTrigger,
//     Rawbutton,
//     TLabel,
//     useAuth,
// } from "~/../../../../open/goaldr/lib" /* ___HOTSWAPPED___ do not commit! */;

// export function Avatar() {
//     const { token, logIn, logOut, idTokenData } = useAuth();

//     const [avatarOpen, setAvatarOpen] = useState(false);

//     return (
//         <DropdownMenu open={avatarOpen} onOpenChange={setAvatarOpen}>
//             <DropdownMenuTrigger asChild>
//                 <Rawbutton className="bg-devotion-action sm:bg-devotion-white hover:bg-muted-foreground hover:bg-devotion-action-hover m-0 flex h-12 gap-2 text-base font-bold sm:pr-2.5">
//                     <CircleUserIcon className="sm:text-devotion-action size-5" />
//                     <span className="sr-only">Toggle user menu</span>
//                     {idTokenData && (
//                         <span className="font-normal sm:hidden">
//                             {idTokenData.given_name} {idTokenData.family_name}
//                         </span>
//                     )}
//                     {avatarOpen ? (
//                         <UpIcon className="sm:text-devotion-action size-5 sm:hidden" />
//                     ) : (
//                         <DownIcon className="sm:text-devotion-action size-5 sm:hidden" />
//                     )}
//                 </Rawbutton>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent className="mr-4 mt-1 flex w-56 flex-col gap-4 p-4 shadow-lg">
//                 {token ? (
//                     <div>
//                         <DropdownMenuItem
//                             className="flex gap-2"
//                             onClick={() =>
//                                 window.open(
//                                     import.meta.env.WEB_URL_MYALDES.trim() +
//                                         "/account/profile",
//                                     "_blank",
//                                     "noopener,noreferrer",
//                                 )
//                             }
//                         >
//                             <>
//                                 <MyProfileIcon className="size-5" />
//                                 <TLabel
//                                     value="My profile"
//                                     className="text-secondary text-base font-normal"
//                                 />
//                             </>
//                         </DropdownMenuItem>
//                         <DropdownMenuItem
//                             className="flex gap-2 "
//                             onClick={() => logOut()}
//                         >
//                             <>
//                                 <LogOutIcon className="size-5 text-red-600" />
//                                 <TLabel
//                                     value="Log out"
//                                     className="text-secondary text-base font-normal text-red-600"
//                                 />
//                             </>
//                         </DropdownMenuItem>
//                     </div>
//                 ) : (
//                     <DropdownMenuItem
//                         className="text-devotion-action flex gap-2 text-base"
//                         onClick={() => logIn()}
//                     >
//                         <>
//                             <LogInIcon className="size-5" />
//                             <TLabel
//                                 value="Log in"
//                                 className="text-secondary text-base font-normal"
//                             />
//                         </>
//                     </DropdownMenuItem>
//                 )}
//             </DropdownMenuContent>
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

// function CircleUserIcon(props: React.SVGProps<SVGSVGElement>) {
//     return (
//         <svg
//             {...props}
//             xmlns="http://www.w3.org/2000/svg"
//             width="24"
//             height="24"
//             strokeWidth="2"
//             viewBox="0 0 24 24"
//             fill="none"
//             stroke="currentColor"
//             strokeLinecap="round"
//         >
//             <circle cx="12" cy="12" r="10" />
//             <path d="M7.5 17C9.8317 14.5578 14.1432 14.4428 16.5 17M14.4951 9.5C14.4951 10.8807 13.3742 12 11.9915 12C10.6089 12 9.48797 10.8807 9.48797 9.5C9.48797 8.11929 10.6089 7 11.9915 7C13.3742 7 14.4951 8.11929 14.4951 9.5Z" />
//         </svg>
//     );
// }

// function MyProfileIcon(props: React.SVGProps<SVGSVGElement>) {
//     return (
//         <svg
//             {...props}
//             xmlns="http://www.w3.org/2000/svg"
//             width="24"
//             height="24"
//             viewBox="0 0 24 24"
//             fill="currentColor"
//             stroke="none"
//             strokeWidth="2"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//         >
//             <path d="M4 18v-.65c0-.34.16-.66.41-.81C6.1 15.53 8.03 15 10 15c.03 0 .05 0 .08.01.1-.7.3-1.37.59-1.98-.22-.02-.44-.03-.67-.03-2.42 0-4.68.67-6.61 1.82-.88.52-1.39 1.5-1.39 2.53V20h9.26c-.42-.6-.75-1.28-.97-2zm6-6c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4m0-6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2m10.75 10c0-.22-.03-.42-.06-.63l1.14-1.01-1-1.73-1.45.49c-.32-.27-.68-.48-1.08-.63L18 11h-2l-.3 1.49c-.4.15-.76.36-1.08.63l-1.45-.49-1 1.73 1.14 1.01c-.03.21-.06.41-.06.63s.03.42.06.63l-1.14 1.01 1 1.73 1.45-.49c.32.27.68.48 1.08.63L16 21h2l.3-1.49c.4-.15.76-.36 1.08-.63l1.45.49 1-1.73-1.14-1.01c.03-.21.06-.41.06-.63M17 18c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2" />
//         </svg>
//     );
// }

// function LogOutIcon(props: React.SVGProps<SVGSVGElement>) {
//     return (
//         <svg
//             {...props}
//             xmlns="http://www.w3.org/2000/svg"
//             width="24"
//             height="24"
//             viewBox="0 0 24 24"
//             fill="currentColor"
//             stroke="none"
//             strokeWidth="1"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//         >
//             <path d="m17 8-1.41 1.41L17.17 11H9v2h8.17l-1.58 1.58L17 16l4-4zM5 5h7V3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h7v-2H5z" />
//         </svg>
//     );
// }

// function LogInIcon(props: React.SVGProps<SVGSVGElement>) {
//     return (
//         <svg
//             {...props}
//             xmlns="http://www.w3.org/2000/svg"
//             width="24"
//             height="24"
//             viewBox="0 0 24 24"
//             fill="currentColor"
//             stroke="none"
//             strokeWidth="1"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//         >
//             <path d="M11 7 9.6 8.4l2.6 2.6H2v2h10.2l-2.6 2.6L11 17l5-5zm9 12h-8v2h8c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-8v2h8z" />
//         </svg>
//     );
// }
