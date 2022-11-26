import {IConfigFileReader} from '@pinkyring/core/interfaces/IConfig';
import findUp from 'find-up';
import dotenv, {DotenvParseOutput} from 'dotenv';
import fs from 'fs';

export default class ConfigFileReader implements IConfigFileReader {
  private _envProps;
  constructor() {
    const envFilePath = this.findEnvFile();
    this._envProps = this.parseEnvFile(envFilePath);
  }

  getValue(key: string): string | undefined {
    const value = this._envProps[key];
    return value;
  }

  private findEnvFile() {
    return findUp.sync('.env');
  }

  private parseEnvFile(filePath: string | undefined) {
    let parsed = {} as DotenvParseOutput;
    if (filePath) {
      parsed = dotenv.parse(fs.readFileSync(filePath, {encoding: 'utf8'}));
    }
    return parsed;
  }

  addValueToEnv(key: string): void {
    const value = this.getValue(key);
    if (value) {
      if (!Object.prototype.hasOwnProperty.call(process.env, key)) {
        process.env[key] = value;
      }
    }
  }
}
