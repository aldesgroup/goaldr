import { useEffect } from "react";
import { log } from "../../utils/logging";

const InnerGoogleTagManager = (props: { gtmID: string }) => {
    useEffect(() => {
        if (
            !document.querySelector(`script[src*="gtm.js?id=${props.gtmID}"]`)
        ) {
            log("adding GTM");

            const script = document.createElement("script");

            script.innerHTML = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${props.gtmID}');`;

            document.head.appendChild(script);
        }

        return () => {
            // document.head.removeChild(script); // Cleanup the script when the component unmounts
        };
    }, [props.gtmID]);

    return null;
};

export function GoogleTagManager(props: { gtmID?: string }) {
    return props.gtmID && <InnerGoogleTagManager gtmID={props.gtmID} />;
}
