import { atom, Atom } from "jotai";
import type { FieldAtom } from "form-atoms";

export type FieldConfig<Value> = {
    /**
     * The embedded field, which we want to enrich with additional functionality
     */
    fieldAtom: FieldAtom<Value>;

    /**
     * Custom hook to condition the rendering of the field, else nothing (or <></>) is rendered
     */
    visible?: () => boolean;

    /**
     * Custom hook to provide a dynamic value for the `disabled` tag if required
     */
    disabled?: () => boolean;

    /**
     * Array of useEffect functions to apply
     */
    effects?: (() => void)[];

    /**
     * An init value, if different from the one provided with the field atom
     */
    initValue?: Value;

    /**
     * A minimum value, for a numeric field
     */
    min?: Value;

    /**
     * A minimum value, for a numeric field
     */
    max?: Value;

    /**
     * Custom hook that can be used to disable a control decreasing the field's value
     */
    minDisabled?: () => boolean;

    /**
     * Custom hook that can be used to disable a control increasing the field's value
     */
    maxDisabled?: () => boolean;
};

/**
 * Extension of https://github.com/form-atoms/form-atoms#FieldAtom to add some capabilities,
 * like the control of the `disable` tag
 */
export type FieldConfigAtom<Value> = Atom<FieldConfig<Value>>;

/**
 *
 * @param config
 * @returns
 */
export function fieldConfigAtom<Value>(
    config: FieldConfig<Value>,
): FieldConfigAtom<Value> {
    return atom({
        fieldAtom: config.fieldAtom,
        visible: config.visible,
        disabled: config.disabled,
        effects: config.effects,
        initValue: config.initValue,
        min: config.min,
        max: config.max,
        minDisabled: config.minDisabled,
        maxDisabled: config.maxDisabled,
        /**
         * options
         * step
         */
    });
}
