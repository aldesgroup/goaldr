import { atom, useAtomValue } from 'jotai';
import { useMemo } from 'react';
import { Label } from '../base';
import { type Field, type FieldOptionInfos, useField } from '../carots';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '../ui/select';
import { useFormGrid } from './FormGrid';
import { fieldLayout } from './fieldLayout';

function SelectEnumOption(props: {
	value: number;
	label: string;
	config?: FieldOptionInfos | undefined;
}) {
	const disabledAtom = useMemo(
		() => props.config?.disabled ?? atom(false),
		[props.config?.disabled],
	);
	const disabled = useAtomValue(disabledAtom);
	return (
		<SelectItem value={props.value.toString()} disabled={disabled}>
			<Label value={props.label} />
		</SelectItem>
	);
}

export function SelectEnumField<T extends Field<any>>({
	label,
	field,
	grid,
}: {
	label: string;
	field: T;
	/** Forces the grid layout on/off; by default follows the parent FormGrid */
	grid?: boolean;
}) {
	const l = fieldLayout(useFormGrid(grid));
	// getting the configured items from the atom
	const [value, setValue] = useField(field);
	const visible = field.visible ? field.visible() : true;
	const disabled = field.disabled ? field.disabled() : false;

	// applying effects if any
	if (field.effects) {
		field.effects.map((effect) => effect());
	}

	// rendering
	return (
		visible &&
		field.options && (
			<div className={l.root}>
				<Label className={l.label} value={label} />
				<div className={l.value}>
					{/* @ts-ignore: the Select's value is a string al'right, but not the field's inner value, which needs a number! */}
					<Select
						value={value.toString()}
						onValueChange={(val: string) => setValue(parseInt(val, 10))}
						disabled={disabled}
					>
						<SelectTrigger>
							{/* the items are not mounted while closed, so we resolve the label ourselves */}
							<SelectValue placeholder="">
								{(selected: string | null) => {
									const option = field.options?.find(
										(item: { value: number; label: string }) =>
											item.value.toString() === selected,
									);
									return option ? <Label value={option.label} /> : null;
								}}
							</SelectValue>
						</SelectTrigger>
						<SelectContent>
							{field.optionsOnly
								? // if we restrict to some values, then we only consider those
									field.optionsOnly
										.map((value) =>
											field.options?.find((item) => item.value === value),
										)
										.map(
											(option) =>
												option && (
													<SelectEnumOption
														key={option.value.toString()}
														{...option}
														config={field.optionsInfos?.get(option.value)}
													/>
												),
										)
								: // else it's normal business, we allow to select any option
									field.options.map((option) => (
										<SelectEnumOption
											key={option.value.toString()}
											{...option}
											config={field.optionsInfos?.get(option.value)}
										/>
									))}
						</SelectContent>
					</Select>
				</div>
			</div>
		)
	);
}
