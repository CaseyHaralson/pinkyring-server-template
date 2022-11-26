import {
  ConfigKey,
  IConfigFileReader,
  ISecretRepository,
} from '../interfaces/IConfig';

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

  // add settings we will need for this package
  //
  // look in .env file
  // look in env
  // look in settings repo
  //
  // get key, protected?
  //

  private _registeredKeys = new Map<string, ConfigKey>();

  registerNeededConfigurations(keys: ConfigKey[]) {
    const missingConfigurations: string[] = [];
    let secretKeyInList = false;
    for (const key of keys) {
      if (this._registeredKeys.has(key.name)) {
        throw new Error(
          `Multiple of the same config key were registered with the ConfigHelper. Only one key by name can be registered at a time. Key: ${key.name}`
        );
      } else {
        this._registeredKeys.set(key.name, key);
      }

      if (this.getConfigValue(key.name) === undefined) {
        missingConfigurations.push(key.name);
      }

      if (key.isSecret) secretKeyInList = true;
    }

    if (missingConfigurations.length > 0) {
      let devMessage = '';
      if (this.isDevelopment()) {
        devMessage = `For the development environment, you may need to add the values to the .env file.`;
      }

      let secretMessage = '';
      if (secretKeyInList) {
        secretMessage = `If the keys should be secret, they will need to be configured with the secret repository.`;
      }

      const message =
        `The following keys' configurations weren't found. Maybe they weren't added to the environment?` +
        (devMessage.length > 0 ? ` ${devMessage}` : ``) +
        (secretMessage.length > 0 ? ` ${secretMessage}` : ``) +
        ` Keys: ${missingConfigurations.join('; ')}`;

      throw new Error(message);
    }
  }

  private getConfigValue(keyName: string): string | undefined {
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
      return fileValue;
    }

    return undefined;
  }

  getEnvironment() {
    const env = process.env.NODE_ENV ?? 'development';
    return env;
  }

  isDevelopment() {
    return this.getEnvironment() === 'development';
  }

  isTest() {
    return this.getEnvironment() === 'test';
  }

  isQAT() {
    return this.getEnvironment() === 'qat';
  }

  isUAT() {
    return this.getEnvironment() === 'uat';
  }

  isProduction() {
    return this.getEnvironment() === 'production';
  }
}
