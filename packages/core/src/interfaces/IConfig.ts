export interface ConfigKey {
  name: string;
  isSecret?: boolean;
  loadIntoEnv?: boolean;
}

export interface ISecretRepository {
  getSecret(key: string): string | undefined;
}

export interface IConfigFileReader {
  getValue(key: string): string | undefined;
  addValueToEnv(key: string): void;
}
