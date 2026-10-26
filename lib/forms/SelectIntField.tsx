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

function SelectIntOption(props: {
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

export function SelectIntField<T extends Field<any>>({
	label,
	field,
}: {
	label: string;
	field: T;
}) {
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
			<div className="flex">
				<Label
					className="mr-4 flex w-cardlabels flex-col justify-center text-right font-light sm:w-smcardlabels"
					value={label}
				/>
				<div className="w-cardvalues sm:w-smcardvalues">
					{/* @ts-ignore: the Select's value is a string al'right, but not the field's inner value, which needs a number! */}
					<Select
						value={value.toString()}
						onValueChange={(val: string) => setValue(parseInt(val, 10))}
						disabled={disabled}
					>
						<SelectTrigger>
							<SelectValue placeholder="" />
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
													<SelectIntOption
														key={option.value.toString()}
														{...option}
														config={field.optionsInfos?.get(option.value)}
													/>
												),
										)
								: // else it's normal business, we allow to select any option
									field.options.map((option) => (
										<SelectIntOption
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
