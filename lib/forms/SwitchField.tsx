import { cn, Label } from '../base';
import { type Field, useField } from '../carots';
import { Switch } from '../ui/switch';
import { useFormGrid } from './FormGrid';
import { fieldLayout } from './fieldLayout';

/**
 * Props for the SwitchField component.
 * @category Types
 */
export type SwitchFieldProps<T extends Field<boolean>> = {
	/** Additional CSS classes for the container */
	className?: string;
	/** The label text for the switch */
	label: string;
	/** Additional CSS classes for the label */
	labelClassName?: string;
	/** The field */
	field: T;
	/** Additional CSS classes for the switch */
	switchClassName?: string;
	/** To disable the field */
	disabled?: boolean;
	/** Additional action to performed on changing the value */
	onChange?: (checked: boolean) => void;
	/** Forces the grid layout on/off; by default follows the parent FormGrid */
	grid?: boolean;
};

/**
 * A form field component that renders a switch input.
 * The switch state is controlled by the field.
 *
 * @param {SwitchFieldProps<confAtom>} props - The component props
 * @returns {JSX.Element} A switch field component with label
 * @category Forms
 */
export function SwitchField<T extends Field<boolean>>({
	field,
	grid,
	...props
}: SwitchFieldProps<T>) {
	const l = fieldLayout(useFormGrid(grid));
	// --- shared state
	const [value, setValue] = useField(field);
	const disabled =
		(field.disabled ? field.disabled() : false) || props.disabled;
	const visible = field.visible ? field.visible() : true;

	// --- local state

	// --- effects
	if (field.effects) {
		// effects configured on the field
		field.effects.map((effect) => effect());
	}

	// --- utils

	// --- rendering
	return visible ? (
		<div className={cn(l.root, props.className)}>
			<Label
				className={cn(l.label, props.labelClassName)}
				value={props.label}
			/>
			<div className={l.value}>
				<Switch
					{...props}
					key={`switch-${value ? '1' : '0'}`}
					className={props.switchClassName}
					disabled={disabled}
					checked={value}
					onCheckedChange={(val) => {
						setValue(val);
						props.onChange?.(val);
					}}
				/>
			</div>
		</div>
	) : null;
}
