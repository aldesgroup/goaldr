import { Label } from '../base';
import { type Field, useField } from '../carots';
import { Button as Rawbutton } from '../ui/button';
import { Input } from '../ui/input';
import { useFormGrid } from './FormGrid';
import { fieldLayout } from './fieldLayout';

export function InputIntField<T extends Field<any>>({
	label,
	field,
	grid,
	...props
}: {
	label: string;
	field: T;
	/** Forces the grid layout on/off; by default follows the parent FormGrid */
	grid?: boolean;
} & React.ComponentProps<'input'>) {
	const l = fieldLayout(useFormGrid(grid));
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
			<div className={l.root}>
				<Label className={l.label} value={label} />
				<div className={l.value}>
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
