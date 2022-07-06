export function WithDefaultTrue(val: any) {
  return val === undefined || val === true
}

export function WithDefaultFalse(val: any) {
  return val === undefined ? false : val === true
}