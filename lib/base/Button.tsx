import * as React from 'react';
import { Button as Rawbutton } from '../ui/button';
import { cn } from './cn';

export interface ButtonProps extends React.ComponentProps<typeof Rawbutton> {
	/** If true, the button will be of type "submit" */
	submit?: boolean;
	/** If true, the button will have a light style */
	light?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, submit, light, ...props }, ref) => {
		return (
			<Rawbutton
				type={submit ? 'submit' : 'button'}
				ref={ref}
				className={cn(
					light
						? 'border-devotion-action border-opacity-50 bg-devotion-grey text-devotion-action border'
						: 'bg-devotion-action',
					className,
				)}
				// uppercase
				// labelClass={cn('font-light', light && '')}
				{...props}
			/>
		);
	},
);

Button.displayName = 'Button';

export { Button };
