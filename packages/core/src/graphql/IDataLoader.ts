export interface IDataLoader<T> {
  load(id: string): Promise<T>;
}
