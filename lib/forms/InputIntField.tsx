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
					className="w-cardlabels sm:w-smcardlabels mr-4 flex flex-col justify-center text-right font-light"
					value={label}
				/>
				<div className="w-cardvalues sm:w-smcardvalues flex">
					<Rawbutton
						type="button"
						className="border-devotion-action border-opacity-50 bg-devotion-grey text-devotion-action hover:bg-devotion-pressed w-10 border text-lg font-bold"
						onClick={() => {
							setValue(value - 1);
						}}
						disabled={decrButtonDisabled}
					>
						-
					</Rawbutton>
					<Input
						{...props}
						className="border-devotion-action mx-3 w-24 text-center"
						readOnly
						disabled
						value={value}
					/>
					<Rawbutton
						type="button"
						className="border-devotion-action border-opacity-50 bg-devotion-grey text-devotion-action hover:bg-devotion-pressed w-10 border font-bold"
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
