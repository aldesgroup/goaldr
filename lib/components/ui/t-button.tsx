import * as React from "react";
import { Button, ButtonProps } from "./button";
import { TLabel } from "./t-label";
import { cn } from "../../utils/cn";

export interface TButtonProps extends ButtonProps {
    label: string;
    labelClass?: string;
    uppercase?: boolean;
}

const TButton = React.forwardRef<HTMLButtonElement, TButtonProps>(
    ({ className, uppercase, labelClass, ...props }, ref) => {
        return (
            <Button ref={ref} {...props} className={cn(className)}>
                <TLabel
                    value={props.label}
                    className={cn(labelClass)}
                    uppercase={uppercase}
                />
            </Button>
        );
    },
);

TButton.displayName = "TButton";

export { TButton };
