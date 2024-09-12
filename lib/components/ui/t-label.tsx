import * as LabelPrimitive from "@radix-ui/react-label";
import * as React from "react";
import { cn } from "../../utils/cn";
import { cva, type VariantProps } from "class-variance-authority";
import { Label } from "./label";
import { useTranslator } from "../../utils/i18n";

// <COPY from the Label component
const labelVariants = cva(
    "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
);

interface labelProps
    extends React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>,
        VariantProps<typeof labelVariants> {}
// COPY>

interface tLabelProps extends labelProps {
    value: string;
    uppercase?: boolean;
}

const TLabel = React.forwardRef<
    React.ElementRef<typeof LabelPrimitive.Root>,
    tLabelProps
>(({ className, value, uppercase, ...props }, ref) => {
    const { translate } = useTranslator();
    const { translation, missing } = translate(value);
    const translated = translation === "" ? "(" + value + ")" : translation;

    return (
        <Label
            ref={ref}
            className={cn(
                className,
                uppercase && "uppercase",
                missing && "italic text-red-500",
            )}
            {...props}
        >
            {translated}
        </Label>
    );
});

TLabel.displayName = "TLabel";

export { TLabel };
