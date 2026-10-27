import { Label } from '../base';
import { type Field, useField } from '../carots';
import { Button as Rawbutton } from '../ui/button';
import { Input } from '../ui/input';

export function InputIntField<T extends Field<any>>({
	label,
	field,
	...props
}: {
	label: string;
	field: T;
} & React.ComponentProps<'input'>) {
	// getting the configured items from the atom
	const [value, setValue] = useField(field);
	const disabled = field.disabled ? field.disabled() : false;
	const visible = field.visible ? field.visible() : true;
	const minReached = field.min !== undefined ? value <= field.min : false;
	const maxReached = field.max !== undefined ? value >= field.max : false;
	const decrementDisabled = field.decrementDisabled
		? field.decrementDisabled()
		: false;
	const incrementDisabled = field.incrementDisabled
		? field.incrementDisabled()
		: false;
	const decrButtonDisabled = disabled || minReached || decrementDisabled;
	const incrButtonDisabled = disabled || maxReached || incrementDisabled;

	// applying effects if any
	if (field.effects) {
		field.effects.map((effect) => effect());
	}

	// rendering
	return (
		visible && (
			<div className="flex">
				<Label
					className="mr-4 flex w-cardlabels flex-col justify-center text-right font-light sm:w-smcardlabels"
					value={label}
				/>
				<div className="flex w-cardvalues sm:w-smcardvalues">
					<Rawbutton
						type="button"
						className="w-10 border border-devotion-action border-opacity-50 bg-devotion-grey text-lg font-bold text-devotion-action hover:bg-devotion-pressed"
						onClick={() => {
							setValue(value - 1);
						}}
						disabled={decrButtonDisabled}
					>
						-
					</Rawbutton>
					<Input
						{...props}
						className="mx-3 w-full border-devotion-action text-center"
						readOnly
						disabled
						value={value}
					/>
					<Rawbutton
						type="button"
						className="w-10 border border-devotion-action border-opacity-50 bg-devotion-grey font-bold text-devotion-action hover:bg-devotion-pressed"
						onClick={() => {
							setValue(value + 1);
						}}
						disabled={incrButtonDisabled}
					>
						+
					</Rawbutton>
				</div>
			</div>
		)
	);
}
