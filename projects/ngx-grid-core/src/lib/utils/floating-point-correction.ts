export function floatingPointCorrection(num: number): number {
  return parseFloat(num.toFixed(13))
}