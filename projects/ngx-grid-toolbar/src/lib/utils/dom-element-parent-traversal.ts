export function HasParentOfClass(c: string, e: HTMLElement | null): boolean {
  return typeof FindParentOfClass(c, e) !== 'undefined'
}

export function FindParentOfClass(c: string, e: HTMLElement | null): HTMLElement | undefined {
  if (!e) return undefined
  if (e.classList.contains(c)) return e
  return FindParentOfClass(c, e.parentElement)
}

export function HasParentMatching(match: HTMLElement, el: HTMLElement | null): boolean {
  if (!el) return false
  if (el === match) return true
  return HasParentMatching(match, el.parentElement)
}
