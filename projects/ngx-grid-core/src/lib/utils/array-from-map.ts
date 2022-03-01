export function ArrayFromMap<T, TKey = any>(map: Map<TKey, T>): Array<T> {
  return Array.from(map).map(([name, value]) => value) 
}