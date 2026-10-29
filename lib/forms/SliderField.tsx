import type { LucideIcon } from 'lucide-react';
import { useState } from 'react';
import { cn, Label } from '../base';
import { type Field, type fieldDisplayMode, useField } from '../carots';
// import { getColors } from '../styling';
import { Slider } from '../ui/slider';
import { useFormGrid } from './FormGrid';
import { fieldLayout } from './fieldLayout';

/**
 * Props for the SliderField component.
 * @category Types
 */
export type SliderFieldProps<T extends Field<number>> = {
	/** Additional CSS classes for the container */
	className?: string;
	/** The label text for the slider */
	label: string;
	/** Additional CSS classes for the label */
	labelClassName?: string;
	/** The field for the slider value */
	field: T;
	/** Additional CSS classes for the slider */
	sliderClassName?: string;
	/** The unit to display with the value (e.g., "%", "px") */
	unit?: string;
	/** The display mode for the field */
	mode?: fieldDisplayMode;
	/** To disable the field */
	disabled?: boolean;
	/** Custom steps can have any value/label and are shown in the order provided.
	 *  Example: [{ value: 30, label: '30min' }, { value: 60, label: '1h' }]
	 */
	customSteps?: { value: number; label: string }[];
	/** The left icon to display next to the slider */
	leftIcon?: LucideIcon;
	/** The right icon to display next to the slider */
	rightIcon?: LucideIcon;
	/** Forces the grid layout on/off; by default follows the parent FormGrid */
	grid?: boolean;
};

// function CurrentStep({
// 	stepMarked,
// 	label,
// }: {
// 	stepMarked: boolean;
// 	label: string;
// }) {
// 	if (!stepMarked) return null;

// 	return (
// 		<div className="bottom-8">
// 			<Label raw className="text-lg font-bold text-primary" value={label} />
// 		</div>
// 	);
// }

/**
 * A form field component that renders a slider with a dynamic value display.
 * The value display follows the slider thumb position and scales based on the current value.
 *
 * @param {SliderFieldProps<confAtom>} props - The component props
 * @returns {JSX.Element} A slider field component with dynamic value display
 * @category Forms
 */
export function SliderField<T extends Field<number>>({
	field,
	...props
}: SliderFieldProps<T>) {
	const l = fieldLayout(useFormGrid(props.grid));
	// shared state
	const [fieldValue, setFieldValue] = useField(field);

	// --- local state
	const customSteps = props.customSteps;
	const [value, setValue] = useState(
		customSteps
			? customSteps.findIndex((step) => step.value === fieldValue)
			: fieldValue,
	);

	// const stepLabel = `${customSteps?.[value]?.label ?? value}${props.unit || ''}`;
	const disabled =
		(field.disabled ? field.disabled() : false) || props.disabled;
	const visible = field.visible ? field.visible() : true;
	const step = props.customSteps ? 1 : field.step || 1;
	const min = customSteps ? 0 : field.min || 0;
	const max = customSteps ? customSteps.length - 1 : field.max || 1;
	const minLabel = (customSteps?.[0]?.label ?? min).toString();
	const maxLabel = (
		customSteps?.[customSteps.length - 1]?.label ?? max
	).toString();
	// const colors = getColors();

	const handleSlidingComplete = (v: number) =>
		setFieldValue(customSteps?.[v]?.value ?? v);

	// --- effects
	if (field.effects) {
		// effects configured on the field
		field.effects.map((effect) => effect());
	}

	// --- rendering
	if (!visible) return null;

	return (
		<div className={cn('my-1', l.root, props.className)}>
			<Label
				className={cn(l.label, props.labelClassName)}
				value={props.label}
			/>
			<div className={cn(l.value, 'min-w-40')}>
				{props.leftIcon && <props.leftIcon className="mr-2" />}
				<Slider
					min={min}
					max={max}
					step={step}
					// minimumTrackTintColor={colors.primary}
					// maximumTrackTintColor={colors.mutedForeground}
					// thumbTintColor={colors.primary}
					disabled={disabled}
					onValueCommitted={(committed: number | readonly number[]) =>
						handleSlidingComplete(
							typeof committed === 'number' ? committed : (committed[0] ?? min),
						)
					}
					onValueChange={(nextValue) =>
						setValue(
							typeof nextValue === 'number' ? nextValue : (nextValue[0] ?? min),
						)
					}
					value={value}
					// StepMarker={({ stepMarked }: { stepMarked: boolean }) => (
					// 	<CurrentStep stepMarked={stepMarked} label={stepLabel} />
					// )}
				/>
				{props.rightIcon && <props.rightIcon className="ml-2" />}
			</div>
			{/* <div className="flex-row justify-between">
				<div className="ml-4 flex-row">
					<Label
						raw
						className="text-muted-foreground"
						append={
							props.unit && (
								<Label
									raw
									className="text-muted-foreground"
									value={props.unit}
								/>
							)
						}
						value={minLabel}
					/>
				</div>
				<div className="mr-4 flex-row">
					<Label
						raw
						className="text-muted-foreground"
						append={
							props.unit && (
								<Label
									raw
									className="text-muted-foreground"
									value={props.unit}
								/>
							)
						}
						value={maxLabel}
					/>
				</div>
			</div> */}
		</div>
	);
}

/*

`minimumTrackTintColor`:
The `SliderPrimitive.Indicator` (`data-slot="slider-range"`), the filled part of the track.
It already has `bg-primary`, so it matches `colors.primary`.

`maximumTrackTintColor`:
The `SliderPrimitive.Track` (`data-slot="slider-track"`), the unfilled part.
It currently uses `bg-muted`. To match `colors.mutedForeground`, change it to `bg-muted-foreground`.
The old Radix version in `old slider.tsx` used `bg-secondary`.

`thumbTintColor`:
The `SliderPrimitive.Thumb` (`data-slot="slider-thumb"`). It is currently `bg-white border-ring`.
To match `colors.primary`, use `bg-primary border-primary`.

`StepMarker`:
Nothing equivalent. RNR calls it with `stepMarked` for the current step, and `SliderField.tsx` used it to show the current label (`CurrentStep`).
The closest option in Base UI is to render the label as a child of the `Thumb`, positioned absolutely above it.
`SliderPrimitive.Value` can supply the current value, but your label comes from `customSteps` and a unit, so you can render `stepLabel` directly.

The wrapper in `slider.tsx` only passes `className` to the root and takes no `children`.
So you can't restyle the track, range or thumb from `SliderField.tsx` as it stands. Two ways to do it:

- **Edit the classes in `slider.tsx`:** this changes every slider in the app, and is fine if you want them all to look the same.
- **Add props to the wrapper:** for example `trackClassName`, `rangeClassName`, `thumbClassName` and a `thumbLabel?: ReactNode`.
`SliderField` would then pass `thumbLabel={<CurrentStep …/>}`. This is the closest replacement for the commented-out props.

*/
