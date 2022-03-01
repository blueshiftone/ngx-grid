export function WithDefaultTrue(val: any) {
  return typeof val === 'undefined' || val === true
}