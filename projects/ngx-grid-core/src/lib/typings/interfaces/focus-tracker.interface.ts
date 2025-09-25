import { InjectionToken, Signal } from "@angular/core"

export interface IFocusTracker {
    hasFocus(id: string): boolean
    setFocus(id: string): void
    clearFocus(id: string): void
    getIsFocusedSignal(id: string): Signal<boolean>
    dispose(id: string): void
}

export const FOCUS_TRACKER = new InjectionToken<IFocusTracker>('FOCUS_TRACKER')
