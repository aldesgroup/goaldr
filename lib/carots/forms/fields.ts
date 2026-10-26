import type { FieldAtom, FormAtom, RESET } from 'form-atoms';
import {
	fieldAtom,
	formAtom,
	useFieldValue as getValue,
	useFieldActions,
	useForm,
} from 'form-atoms';
import type { Atom, WritableAtom } from 'jotai';
import { atom, useAtom, useSetAtom, useStore } from 'jotai';
import { useCallback, useMemo } from 'react';

// ------------------------------------------------------------------------------------------------
// Base structure for defining a model
// ------------------------------------------------------------------------------------------------

/**
 * A Model contains the fields, form atom, and state atoms for a complete form setup.
 * @property {T} fields - The original fields object
 * @property {FormAtom<{[K in keyof T]: FieldAtom<any>}>} form - The form atom built from the fields
 * @property {FieldMetaAtom[]} states - Array of all FieldMetaAtom from the fields
 */
export type Model<T extends Record<string, Field<any>>> = T & {
	_URL: string;
	_fields: T;
	_form: FormAtom<{ [K in keyof T]: FieldAtom<any> }>;
	_states: FieldMetaAtom<any>[];
};

/**
 * Creates a new Model with fields, form atom, and state atoms.
 * @param {T} fields - Object with named Field objects
 * @returns {Model<T>} Complete model with fields, form, and states
 * @category Forms Utils
 */
export function newModel<T extends Record<string, Field<any>>>(
	url: string,
	fields: T,
): Model<T> {
	const fieldsMap = Object.entries(fields).reduce<
		Record<string, FieldAtom<any>>
	>((acc, [key, field]) => {
		acc[key] = field.valueAtom;
		return acc;
	}, {});

	return {
		...fields, // this provides a direct access to each field, without writing "._fields" in between
		_URL: url,
		_fields: fields,
		_form: formAtom(fieldsMap) as FormAtom<{ [K in keyof T]: FieldAtom<any> }>,
		_states: Object.values(fields).map((field) => field.stateAtom),
	};
}

/**
 * "State" part of a field: holds the underlying atoms for the field's value and state.
 * @property {string} name - The field name, which can come in handy in logging / debug situations
 * @property {FieldAtom<Value>} valueAtom - Form-atoms field atom that stores the current value.
 * @property {FieldStateAtom} stateAtom - Jotai atom holding auxiliary UI state for the field.
 * @category Forms Utils
 */
export type fieldState<Value> = {
	name: string;
	valueAtom: FieldAtom<Value>;
	stateAtom: FieldMetaAtom<Value>;
};

/**
 * Optional, UI-oriented and validation-related capabilities that can be attached to a field.
 * These do not include the atoms, which are defined in fieldState.
 * @property {Value} [initialValue] - The field's initial value
 * @property {() => boolean} [visible] - Predicate to conditionally render the field.
 * @property {() => boolean} [disabled] - Predicate to dynamically disable interactions.
 * @property {(() => void)[]} [effects] - Array of effects to run on mount/render.
 * @property {number} [min] - Min numeric value or minimum string length.
 * @property {number} [max] - Max numeric value or maximum string length.
 * @property {number} [step] - Numeric step for increment/decrement controls.
 * @property {() => boolean} [decrementDisabled] - Predicate disabling decrement controls.
 * @property {() => boolean} [incrementDisabled] - Predicate disabling increment controls.
 * @property {FieldOption[]} [options] - Select options (used for enums).
 * @property {number[]} [optionsOnly] - Allowed numeric values among options.
 * @property {Map<number, FieldOptionInfos>} [optionsInfos] - Extra metadata per option.
 * @property {boolean | (() => boolean)} [mandatory] - Whether a non-empty value is required.
 * @property {() => null | FieldValueError} [valid] - Custom validator; return null if valid.
 * @category Forms Utils
 */
export type fieldSpecs<Value> = {
	initialValue: Value;
	visible?: () => boolean;
	disabled?: () => boolean;
	effects?: (() => void)[];
	min?: number | undefined;
	max?: number | undefined;
	step?: number | undefined;
	decrementDisabled?: () => boolean;
	incrementDisabled?: () => boolean;
	options?: FieldOption[];
	optionsOnly?: number[];
	optionsInfos?: Map<number, FieldOptionInfos>;
	mandatory?: boolean | (() => boolean);
	valid?: () => null | FieldValueError;
};

/**
 * Any field is of this type
 * @category Forms Utils
 */
export type Field<Value> = fieldState<Value> & fieldSpecs<Value>;

/**
 * Factory creating a minimal field with its atoms initialized.
 * @param {Value} initialValue - Initial value for the field's valueAtom.
 * @returns {Field<Value>} Field composed of BaseField; extras can be merged by the caller.
 * @category Forms Utils
 */
export function newField<Value>(
	name: string,
	specs: fieldSpecs<Value>,
): Field<Value> {
	return {
		name: name,
		valueAtom: fieldAtom({ value: specs.initialValue }),
		stateAtom: stateAtom(),
		...specs,
	};
}

// ------------------------------------------------------------------------------------------------
// Hooks to get and set 1 field value
// ------------------------------------------------------------------------------------------------

/**
 * Hook to get the value of a form field.
 * @param {Field<Value>} conf - The field atom.
 * @returns {Value} The value of the form field.
 * @category Forms Utils
 */
export function useFieldValue<Value>(field: Field<Value>) {
	const fieldValue = getValue(field.valueAtom);
	return fieldValue;
}

/**
 * Hook to set the value of a form field.
 * @param {Field<Value>} conf - The field atom.
 * @returns {Function} A function to set the value of the form field.
 * @category Forms Utils
 */
export function useSetField<Value>(field: Field<Value>) {
	const actions = useFieldActions(field.valueAtom);
	const setState = useSetAtom(field.stateAtom);

	// this way we always set the date the value was modified
	const setValue = useCallback(
		(value: typeof RESET | Value | ((prev: Value) => Value)) => {
			actions.setValue(value);
			setState((prev) => ({ ...prev, lastModified: new Date() }));
		},
		[actions, setState],
	);

	return setValue;
}

/**
 * Hook to get and set the value of a form field, similar to useState.
 * @param {Field<Value>} conf - The field atom.
 * @returns {[Value, Function]} A tuple containing the value and a function to set the value.
 * @category Forms Utils
 */
export function useField<Value>(
	field: Field<Value>,
): [Value, (value: typeof RESET | Value | ((prev: Value) => Value)) => void] {
	const value = useFieldValue(field);
	const setValue = useSetField(field);
	return [value, setValue];
}

// ------------------------------------------------------------------------------------------------
// Handling field state
// ------------------------------------------------------------------------------------------------

/**
 * Some additional properties not available in the form-atoms library
 * @property {Date} lastModified - When the field's value was last modified
 * @property {Value} lastModified - When the field's value was last modified
 * @category Forms Utils
 */
export type FieldMeta<Value> = {
	lastModified: Date | null; // the last time the user changed the value
	lastSyncedVal: Value | null; // the value retrieved from the aforementioned external system
};

/**
 * Type for the atoms that we use to conceal additional properties associated with a field
 * @category Forms Utils
 */
export type FieldMetaAtom<Value> = WritableAtom<
	FieldMeta<Value>,
	[FieldMeta<Value> | ((prev: FieldMeta<Value>) => FieldMeta<Value>)],
	void
>;

/**
 * Creates a field state atom, to associated with a field atom inside a field
 */
export function stateAtom<Value>(): FieldMetaAtom<Value> {
	return atom<FieldMeta<Value>>({
		lastModified: null,
		lastSyncedVal: null,
	});
}

/**
 * Hook to get and set the lastModified flag from a FieldMetaAtom.
 * @param {Field<Value>} field - The field state atom containing lastModified.
 * @returns {[Date | null, (date: Date) => void]} The current lastModified and a setter.
 * @category Forms Utils
 */
// TODO automatically call it when setting the value of a field?!?
export function useFieldMeta<Value>(
	field: Field<Value>,
): [FieldMeta<Value>, (syncedVal: Value) => void] {
	const [state, setState] = useAtom(field.stateAtom);
	const setSyncedVal = (syncedVal: Value) => {
		setState((prev) => ({
			...prev,
			lastSyncedVal: syncedVal,
		}));
	};
	return [state, setSyncedVal];
}

// ------------------------------------------------------------------------------------------------
// Field value options
// ------------------------------------------------------------------------------------------------

/**
 * Type definition for a field option.
 * @property {number} value - The value of the option.
 * @property {string} label - The label of the option.
 * @category Forms Utils
 */
export type FieldOption = { value: number; label: string };

/**
 * Type definition for additional information about a field option.
 * @property {Atom<boolean>} [disabled] - An atom that determines if the option is disabled.
 * @property {LucideIcon} [icon] - An icon associated with the option.
 * @category Forms Utils
 */
export type FieldOptionInfos = { disabled?: Atom<boolean> };

// ------------------------------------------------------------------------------------------------
// Field value error
// ------------------------------------------------------------------------------------------------

/**
 * Type definition for a field value error.
 * @property {string} msg - The error message.
 * @property {any} [param] - Additional parameters for the error.
 * @category Forms Utils
 */
export type FieldValueError = { msg: string; param?: any };

/**
 * Hook to check if a particular field is valid, using the field's configured 'valid' custom hook,
 * or the field's configured basic constraints. Returns null if valid, the validation error otherwise.
 * @param {Field<Value>} fieldConfAtom - The field atom.
 * @returns {null | FieldValueError} The validation error, or null if valid.
 * @category Forms Utils
 */
export function useFieldValidationError<Value>(field: Field<Value>) {
	const validError = field.valid?.();
	const value = getValue(field.valueAtom) as Value;
	const mandatory =
		field.mandatory &&
		(typeof field.mandatory === 'function'
			? field.mandatory()
			: field.mandatory);

	// checking the custom validation hook first (if there's one), since the computation's been done anyway!
	if (validError) {
		return validError;
	}

	if (typeof value === 'number') {
		if (field.options) {
			// special case of enums
			const options = field.optionsOnly
				? field.optionsOnly
				: field.options.map((option) => option.value);
			if (value) {
				if (!options.some((val) => val === value)) {
					return { msg: 'This value is not allowed', param: field.min || 0 };
				}
			} else if (mandatory) {
				return { msg: 'A value must be provided here' };
			}
		} else {
			if (typeof field.min === 'number' && value < field.min) {
				return { msg: 'Must be greater than or equal to', param: field.min };
			}
			if (typeof field.max === 'number' && value > field.max) {
				return { msg: 'Must be less than or equal to', param: field.max };
			}
			if (mandatory && !value && value !== 0) {
				return { msg: 'A value must be provided here' };
			}
		}
	} else if (typeof value === 'string') {
		const min = field.min || 0;
		const max = field.max || 0;
		if (min > 0 && value.length > 0 && value.length < min) {
			return { msg: 'Minimum required length not reached', param: min };
		}
		if (max > 0 && value.length > 0 && value.length > max) {
			return { msg: 'Maximum required length exceeded', param: max };
		}
		if (mandatory && value.length === 0) {
			return { msg: 'A value must be provided here' };
		}
	} else {
		if (mandatory && !value) {
			return { msg: 'A value must be provided here' };
		}
	}

	return null;
}

/**
 * Hook that returns the first validation error found across the given model's fields.
 * Returns null if no error.
 */
export function useModelValidationError<T extends Record<string, Field<any>>>(
	model: Model<T>,
) {
	const fieldErrors = Object.values(model._fields).map((field) =>
		useFieldValidationError(field),
	);

	return useMemo(() => {
		return fieldErrors.find((err) => err !== null) || null;
	}, [fieldErrors]);
}

// ------------------------------------------------------------------------------------------------
// Hooks to get and set field values, for fields of the same type
// ------------------------------------------------------------------------------------------------

/**
 * Display modes for form fields.
 * @category Forms Utils
 */
export type fieldDisplayMode =
	| 'input' // when a field is displayed in a way that allows to modify its value
	| 'sheet' // when a field is displayed as read-only in a sheet
	| 'report'; //  when a field is displayed as read-only in a report

/**
 * Hook to check that a predicate function returns true for at least 1 form field of the given list.
 * @param {Field<Value>[]} fields - The list of field atoms.
 * @param {(value: Value) => boolean} predicate - The predicate function to check.
 * @returns {boolean} True if the predicate returns true for at least one field.
 * @category Forms Utils
 */
export function useCheckSomeFormFieldValue<Value>(
	fields: Field<Value>[],
	predicate: (value: Value) => boolean,
): boolean {
	const atomValues = fields.map((field) => useFieldValue(field));

	return useMemo(() => {
		return atomValues.some(predicate);
	}, [atomValues, predicate]);
}

/**
 * Hook to check that a predicate function returns true for all the form fields of the given list.
 * @param {Field<Value>[]} fields - The list of field atoms.
 * @param {(value: Value) => boolean} predicate - The predicate function to check.
 * @returns {boolean} True if the predicate returns true for all fields.
 * @category Forms Utils
 */
export function useCheckAllFormFieldValues<Value>(
	fields: Field<Value>[],
	predicate: (value: Value) => boolean,
): boolean {
	const atomValues = fields.map((field) => useFieldValue(field));

	return useMemo(() => {
		return atomValues.every(predicate);
	}, [atomValues, predicate]);
}

/**
 * Hook to get an array with all the given form fields' values.
 * @param {Field<Value>[]} fields - The list of field atoms.
 * @returns {Value[]} An array of form field values.
 * @category Forms Utils
 */
export function useAllFormFieldsValues<Value>(fields: Field<Value>[]) {
	return fields.map((field) => useFieldValue(field));
}

/**
 * Hook to get an array with all the given form fields' setters.
 * @param {Field<Value>[]} fields - The list of field atoms.
 * @returns {Array<(value: typeof RESET | Value | ((prev: Value) => Value)) => void>} An array of setter functions.
 * @category Forms Utils
 */
export function useAllFormFieldsSetters<Value>(
	fields: Field<Value>[],
): Array<(value: typeof RESET | Value | ((prev: Value) => Value)) => void> {
	return fields.map((field) => useSetField(field));
}

/**
 * Hook to set a value to all the given form fields at once.
 * @param {Field<Value>[]} fields - The list of field atoms.
 * @returns {Function} A function to set the value of all form fields.
 * @category Forms Utils
 */
export function useSetAllFormFields<Value>(fields: Field<Value>[]) {
	const valueSetters = fields.map((field) => useSetField(field));

	const setAllValues = useCallback(
		(newValue: typeof RESET | Value | ((prev: Value) => Value)) => {
			valueSetters.forEach((setValue) => {
				setValue(newValue as any);
			});
		},
		[valueSetters],
	);

	return setAllValues;
}

// ------------------------------------------------------------------------------------------------
// Hooks / functions to work with models
// ------------------------------------------------------------------------------------------------

/**
 * An empty form configuration.
 * @category Forms Utils
 */
export const emptyForm = formAtom({});

/**
 * This hook function should reset a model, i.e. reset the form, and reset all the field states.
 * @param {Model<T extends Record<string, Field<any>>>} model - The model object
 * @returns {void}
 * @category Forms Utils
 */
export function useResetModel<T extends Record<string, Field<any>>>(
	model: Model<T> | null,
) {
	const form = useForm(model?._form ?? (emptyForm as FormAtom<any>));
	const store = useStore();

	return useCallback(() => {
		if (!model) return;
		form.reset();
		model._states.forEach((stateAtom) => {
			store.set(stateAtom, (prev: FieldMeta<any>) => ({
				...prev,
				lastModified: null,
				lastSyncedVal: null,
			}));
		});
	}, [form, store, model]);
}
