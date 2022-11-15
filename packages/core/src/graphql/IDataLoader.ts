export interface IDataLoader<T> {
  load(id: string): T;
}
