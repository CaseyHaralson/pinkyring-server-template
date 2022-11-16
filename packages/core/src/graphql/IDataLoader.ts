import {BaseObject} from '../dtos/blogPost';

export interface IDataLoader<T> {
  load(id: string): Promise<T>;
}

export function mapObjectsToKeys<T extends BaseObject>(
  keys: readonly string[],
  objs: T[]
) {
  const map: {[key: string]: T} = {};
  objs.forEach((item) => [(map[item.id] = item)]);

  return keys.map((key) => map[key]);
}
