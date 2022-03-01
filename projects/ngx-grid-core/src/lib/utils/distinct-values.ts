export function DistinctValues<T>(input: Array<T>): Array<T> {
  return Array.from(new Set(input))
}
