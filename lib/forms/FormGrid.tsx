import { createContext, type ReactNode, useContext } from 'react';
import { cn } from '../base';

const FormGridContext = createContext(false);

/** Two-column label/value grid; fields inside it align automatically. */
export function FormGrid(props: { children?: ReactNode; className?: string }) {
	return (
		<FormGridContext value={true}>
			<div
				className={cn(
					'grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-2',
					props.className,
				)}
			>
				{props.children}
			</div>
		</FormGridContext>
	);
}

/** An explicit `grid` prop wins over the context; undefined follows the parent. */
export function useFormGrid(grid?: boolean) {
	const inGrid = useContext(FormGridContext);
	return grid ?? inGrid;
}
