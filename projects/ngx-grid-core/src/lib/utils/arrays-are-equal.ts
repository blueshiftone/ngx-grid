export function ArraysAreEqual(ar1: any[], ar2: any[]) {
  if (!Array.isArray(ar1) || !Array.isArray(ar2)) return false

  if (ar1.length !== ar2.length) return false

  for (var i = 0, l=ar1.length; i < l; i++) {
    if (ar1[i] !== ar2[i]) return false
  }

  return true
}
