export function Randomish(): string {
  return Math.random().toString(36).substr(2)
}
