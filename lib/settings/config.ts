import { initI18n } from './i18n';

export interface GoaldrConfig {
	apiUrl: string;
}

// small helper so each layer doesn't repeat the boilerplate
export const createConfigStore = <T>(name: string) => {
	let value: T | undefined;
	return {
		set: (c: T) => {
			value = c;
		},
		get: (): T => {
			if (!value) throw new Error(`${name} used before being initialised`);
			return value;
		},
	};
};

const store = createConfigStore<GoaldrConfig>('GoaldR');
export const getGoaldrConfig = store.get;

export const initGoaldr = (config: GoaldrConfig) => {
	store.set(config);
	initI18n(config);
};
