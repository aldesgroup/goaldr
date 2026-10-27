import { initI18n } from './i18n';

// the base configuration for GoaldR
export interface baseGoaldrConfig {
	// the API URL
	ApiURL: string;
	// the application name
	AppName: string;
	// the supported languages
	Languages: string[];
}

// the supported cloud types for this configuration
export type CloudType = 'Azure' | 'AWS' | 'GCP';

interface AzureConfig {
	// the cloud type for this configuration
	CloudType: 'Azure';
	// the Azure tenant ID for this configuration
	AzureTenantID: string;
	// the Azure subdomain for this configuration
	AzureSubdomain: string;
	// the Azure client ID for this configuration
	AzureClientID: string;
}

interface NonAzureConfig {
	CloudType: Exclude<CloudType, 'Azure'>;
	AzureTenantID?: never;
	AzureSubdomain?: never;
	AzureClientID?: never;
}

// the complete configuration for GoaldR, combining the base configuration with cloud-specific settings
export type GoaldrConfig = baseGoaldrConfig & (AzureConfig | NonAzureConfig);

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

// the configuration store for GoaldR
const store = createConfigStore<GoaldrConfig>('GoaldR');
export const getGoaldrConfig = store.get;

// initialize the GoaldR configuration with the provided settings
export const initGoaldr = (config: GoaldrConfig) => {
	store.set(config);
	initI18n(config);
};
