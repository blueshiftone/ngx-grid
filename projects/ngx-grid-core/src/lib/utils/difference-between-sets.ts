export function SetDifference(a: Set<any>, b: Set<any>) {
  return [...Array.from(setMinus(new Set(a), new Set(b))), ...Array.from(setMinus(new Set(b), new Set(a)))]
}

// Adapted from:  https://stackoverflow.com/a/64245521/288564
function *setMinus(a: Set<any>, b: Set<any>) {
  for (const v of b.values()) {
    if (!a.delete(v)) yield v;
  }
  for (const v of a.values()) yield v;
}
