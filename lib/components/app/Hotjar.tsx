import { useEffect } from "react";

function InnerHotjar(props: { hotjarID: string }) {
    useEffect(() => {
        console.log("adding Hotjar");

        const script = document.createElement("script");

        script.innerHTML = `(function(h,o,t,j,a,r){
            h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
            h._hjSettings={hjid:${props.hotjarID},hjsv:6};
            a=o.getElementsByTagName('head')[0];
            r=o.createElement('script');r.async=1;
            r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
            a.appendChild(r);
        })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');`;

        document.getElementsByTagName("head")[0].appendChild(script);
    }, []);

    return null;
}

export function Hotjar(props: { hotjarID?: string }) {
    return (
        props.hotjarID && (
            <>
                <InnerHotjar hotjarID={props.hotjarID} />
                <p>Hotjar there!</p>
            </>
        )
    );
}
