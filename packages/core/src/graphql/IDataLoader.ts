export interface IDataLoaderConstructable {
  new <K, V>(batchLoaderFn: BatchLoadFn<K, V>): IDataLoader<K, V>;
}

type BatchLoadFn<K, V> = (
  keys: ReadonlyArray<K>
) => PromiseLike<ArrayLike<V | Error>>;

export interface IDataLoader<K, T> {
  load(key: K): Promise<T>;
}
