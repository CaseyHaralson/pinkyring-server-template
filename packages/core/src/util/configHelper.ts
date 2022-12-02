import {
  ConfigKey,
  IConfigFileReader,
  ISecretRepository,
} from '../interfaces/IConfig';
import {CONFIGKEYNAME_PROJECTDATA_PREFIX} from '../interfaces/IConfig';

export enum Environment {
  DEVELOPMENT = 'development',
  TEST = 'test',
  QAT = 'qat',
  UAT = 'uat',
  PRODUCTION = 'production',
}

const CONFIGKEYNAME_ENVIRONMENT = 'NODE_ENV';

export default class ConfigHelper {
  private _secretRepository;
  private _configFileReader;
  constructor(
    secretRepository: ISecretRepository,
    configFileReader: IConfigFileReader
  ) {
    this._secretRepository = secretRepository;
    this._configFileReader = configFileReader;
  }

  private _registeredKeys = new Map<string, ConfigKey>();

  registerNeededConfigurations(keys: ConfigKey[]) {
    const missingConfigurations: string[] = [];
    let secretKeyInList = false;
    let projectDataKeyInList = false;
    for (const key of keys) {
      if (this._registeredKeys.has(key.name)) {
        throw new Error(
          `Multiple of the same config key were registered with the ConfigHelper. Only one key by name can be registered at a time. Key: ${key.name}`
        );
      } else {
        this._registeredKeys.set(key.name, key);
      }

      if (this.getPossiblyUndefinedConfigValue(key.name) === undefined) {
        missingConfigurations.push(key.name);
      }

      if (key.isSecret) secretKeyInList = true;
      if (key.name.startsWith(CONFIGKEYNAME_PROJECTDATA_PREFIX)) {
        projectDataKeyInList = true;
      }
    }

    if (missingConfigurations.length > 0) {
      let devMessage = '';
      if (this.getEnvironment() === Environment.DEVELOPMENT) {
        devMessage = `For the development environment, you may need to add the values to the .env file.`;
      }

      let secretMessage = '';
      if (secretKeyInList) {
        secretMessage = `If the keys should be secret, they will need to be configured with the secret repository.`;
      }

      let missingPackageFileMessage = '';
      if (projectDataKeyInList) {
        missingPackageFileMessage = `Also, check to make sure a package.json file exists at the root of the project.`;
      }

      const message =
        `The following keys' configurations weren't found. Maybe they weren't added to the environment?` +
        (devMessage.length > 0 ? ` ${devMessage}` : ``) +
        (secretMessage.length > 0 ? ` ${secretMessage}` : ``) +
        (missingPackageFileMessage.length > 0
          ? ` ${missingPackageFileMessage}`
          : ``) +
        ` Keys: ${missingConfigurations.join('; ')}`;

      throw new Error(message);
    }
  }

  getConfigValue(keyName: string): string {
    const value = this.getPossiblyUndefinedConfigValue(keyName);
    return value ?? '';
  }

  private getPossiblyUndefinedConfigValue(keyName: string): string | undefined {
    const configKey = this._registeredKeys.get(keyName);
    if (configKey === undefined) {
      throw new Error(
        `The key [${keyName}] for the requested config value wasn't found in the registered configurations. Register the key with the ConfigHelper before requesting the value.`
      );
    }

    // try and get the value from a secret first
    if (configKey.isSecret) {
      return this._secretRepository.getSecret(configKey.name);
    }

    // then try from the environment
    const environmentValue = process.env[configKey.name];
    if (environmentValue !== undefined) {
      return environmentValue;
    }

    // lastly try to read from a file
    const fileValue = this._configFileReader.getValue(configKey.name);
    if (fileValue !== undefined) {
      if (configKey.loadIntoEnv) {
        this._configFileReader.addValueToEnv(keyName);
      }

      return fileValue;
    }

    return undefined;
  }

  getEnvironment() {
    this.registerEnvironmentAsNeededConfig();
    const env =
      this.getPossiblyUndefinedConfigValue(CONFIGKEYNAME_ENVIRONMENT) ??
      'development';
    return env as Environment;
  }

  private registerEnvironmentAsNeededConfig() {
    if (this._registeredKeys.get(CONFIGKEYNAME_ENVIRONMENT) === undefined) {
      this._registeredKeys.set(CONFIGKEYNAME_ENVIRONMENT, {
        name: CONFIGKEYNAME_ENVIRONMENT,
      });
    }
  }
}
