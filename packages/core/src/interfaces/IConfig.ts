/** Keys used to get configuration values */
export interface ConfigKey {
  /** the key used in the config */
  name: string;
  /** should the key always come from a secret? */
  isSecret?: boolean;
  /**
   * should the value be loaded into the environment?
   * (probably don't need to set this except for very specific circumstances)
   */
  loadIntoEnv?: boolean;
}

export interface ISecretRepository {
  getSecret(key: string): string | undefined;
}

export interface IConfigFileReader {
  getValue(key: string): string | undefined;
  addValueToEnv(key: string): void;
}

export const CONFIGKEYNAME_PROJECTDATA_PREFIX = 'PROJECTDATA.';
