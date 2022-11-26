import {IConfigFileReader} from '@pinkyring/core/interfaces/IConfig';

export default class ConfigFileReader implements IConfigFileReader {
  getValue(key: string): string | undefined {
    throw new Error('Method not implemented.');
  }
}
