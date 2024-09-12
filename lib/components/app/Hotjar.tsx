import { useEffect } from "react";
import { debug } from "../../utils/debug";

function InnerHotjar(props: { hotjarID: string }) {
    useEffect(() => {
        if (
            !document.querySelector(
                `script[src*="hotjar.com/c/hotjar-${props.hotjarID}.js"]`,
            )
        ) {
            debug("adding Hotjar");

            const script = document.createElement("script");

            script.innerHTML = `(function(h,o,t,j,a,r){
                h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                h._hjSettings={hjid:${props.hotjarID},hjsv:6};
                a=o.getElementsByTagName('head')[0];
                r=o.createElement('script');r.async=1;
                r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                a.appendChild(r);
            })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');`;

            document.head.appendChild(script);
        }

        return () => {
            // document.head.removeChild(script); // Cleanup the script when the component unmounts
        };
    }, [props.hotjarID]);

    return null;
}

export function Hotjar(props: { hotjarID?: string }) {
    return props.hotjarID && <InnerHotjar hotjarID={props.hotjarID} />;
}
