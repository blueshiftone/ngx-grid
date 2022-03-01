export function WithoutValues<T>(arr: Array<T>, withoutValues: Array<T>): Array<T> {
  return (arr ?? []).filter(x => !(withoutValues ?? []).includes(x));
}
