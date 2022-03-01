export function DeleteFromArray<T>(ar: T[], item: T) {
  const idx = ar.indexOf(item)
  if (idx < 0) return
  ar.splice(ar.indexOf(item), 1)
}

export function DeleteFromArrayByKey(ar: any[], key: string, value: any) {
  const existing = ar.find(el => el[key] === value)
  if (!existing) return
  DeleteFromArray(ar, existing)
}
