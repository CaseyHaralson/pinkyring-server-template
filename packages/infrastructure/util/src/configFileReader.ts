import {IConfigFileReader} from '@pinkyring/core/interfaces/IConfig';
import findUp from 'find-up';
import dotenv, {DotenvParseOutput} from 'dotenv';
import fs from 'fs';
import {CONFIGKEYNAME_PROJECTDATA_PREFIX} from '@pinkyring/core/interfaces/IConfig';

export default class ConfigFileReader implements IConfigFileReader {
  private _envProps;
  private _packageData;
  constructor() {
    const envFilePath = this.findEnvFile();
    this._envProps = this.parseEnvFile(envFilePath);

    const packageJsonPath = this.findRootLevelPackageJson(envFilePath);
    this._packageData = this.loadProjectPackageJsonData(packageJsonPath);
  }

  getValue(key: string): string | undefined {
    if (key.startsWith(CONFIGKEYNAME_PROJECTDATA_PREFIX)) {
      const temp = this.tryGetFromPackageData(key);
      return temp;
    }

    const value = this._envProps[key];
    return value;
  }

  private findEnvFile() {
    return findUp.sync('.env');
  }

  private findRootLevelPackageJson(envFilePath: string | undefined) {
    let rootLevelFilePath = envFilePath;
    if (rootLevelFilePath !== undefined) {
      rootLevelFilePath = rootLevelFilePath.replace('.env', '');
    }

    if (rootLevelFilePath === undefined || rootLevelFilePath.length == 0) {
      rootLevelFilePath = findUp.sync('.env.example');
      if (rootLevelFilePath !== undefined) {
        rootLevelFilePath = rootLevelFilePath.replace('.env.example', '');
      }
    }

    if (rootLevelFilePath === undefined || rootLevelFilePath.length == 0) {
      rootLevelFilePath = findUp.sync('package.json');
    } else {
      rootLevelFilePath = rootLevelFilePath + 'package.json';
    }

    return rootLevelFilePath;
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

  private loadProjectPackageJsonData(filePath: string | undefined) {
    if (filePath) {
      const json = JSON.parse(fs.readFileSync(filePath, 'utf8')) as JSONObject;

      // console.log(
      //   `Got data from the package.json file: ${JSON.stringify(json)}`
      // );

      return json;
    }
  }

  private tryGetFromPackageData(key: string) {
    const packageKey = key
      .substring(CONFIGKEYNAME_PROJECTDATA_PREFIX.length)
      .toLowerCase();
    const value = this._packageData?.[packageKey];

    if (value === undefined) return value;
    if (typeof value === 'string') return value;
    if (typeof value === 'number') return value.toString();
    if (typeof value === 'boolean') return String(value);

    return JSON.stringify(value);
  }
}

type JSONValue = string | number | boolean | JSONObject | JSONArray | undefined;

interface JSONObject {
  [x: string]: JSONValue;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface JSONArray extends Array<JSONValue> {}
