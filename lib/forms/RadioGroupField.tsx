import { Label } from '../base';
import { type Field, useField } from '../carots';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';

export function RadioGroupField<T extends Field<any>>({
	// label,
	field,
}: {
	// label: string;
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
				{/* @ts-ignore: the RadioGroup's value is a string al'right, but not the field's inner value, which needs a number! */}
				<RadioGroup
					value={value.toString()}
					onValueChange={(val: string) => setValue(parseInt(val, 10))}
					disabled={disabled}
				>
					{field.options.map((option) => (
						<div className="my-0.5 flex" key={option.value.toString()}>
							<RadioGroupItem value={option.value.toString()} />
							<Label className="ml-3 font-light" value={option.label} />
						</div>
					))}
				</RadioGroup>
			</div>
		)
	);
}
