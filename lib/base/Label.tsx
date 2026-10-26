import { cn } from 'cn';
import { useTranslator } from '../settings';
import { Label as LabelPrimitive } from '../ui/label';

interface labelProps extends React.ComponentProps<'label'> {
	/** The text value for the label */
	value: string;
	/** If true, the text is not translated */
	raw?: boolean; // if true, then the text is not translated
	/** Content to display before the text */
	prepend?: React.ReactNode;
	/** Content to display after the text */
	append?: React.ReactNode;
	/** To style the text, with NativeWind */
	className?: string | undefined;
	/** If true, the text is uppercase */
	uppercase?: boolean;
	/** If true, then the first letter is capitalized */
	capitalizeFirst?: boolean;
}

export function Label({ className, value, uppercase, ...props }: labelProps) {
	const { translate } = useTranslator();
	const { translation, missing } = props.raw
		? { translation: value, missing: false }
		: translate(value);
	const translated = translation === '' ? `(${value})` : translation;
	const displayedText = props.capitalizeFirst
		? translated.charAt(0).toUpperCase() + translated.slice(1)
		: translated;

	return (
		<LabelPrimitive
			className={cn(
				className,
				uppercase && 'uppercase',
				missing && 'italic text-red-500',
			)}
			{...props}
		>
			{displayedText}
		</LabelPrimitive>
	);
}
