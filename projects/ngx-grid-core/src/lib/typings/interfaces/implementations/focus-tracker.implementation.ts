import { signal, Signal, WritableSignal } from "@angular/core"
import { IFocusTracker } from "../focus-tracker.interface"

export class FocusTracker implements IFocusTracker {
    private static _focusStack: string[] = []
    private static _signals: { [key: string]: WritableSignal<boolean> } = {}
    
    hasFocus(id: string): boolean {
        return id && FocusTracker._focusStack[0] == id ? true : false
    }
    setFocus(id: string): void {
        if (this.hasFocus(id)) {
            return;
        }
        const lastSeenFocusedId = FocusTracker._focusStack[0]
        FocusTracker._focusStack = [id, ...FocusTracker._focusStack.filter(x => x !== id)]
        this.updateSignal(id)
        this.updateSignal(lastSeenFocusedId)
    }
    clearFocus(id: string): void {
        FocusTracker._focusStack = FocusTracker._focusStack.filter(x => x !== id)
        this.updateSignal(id)
        this.updateSignal(FocusTracker._focusStack[0])
    }
    getIsFocusedSignal(id: string): Signal<boolean> {
        if (!FocusTracker._signals[id]) {
            FocusTracker._signals[id] = signal(this.hasFocus(id))
        }
        return FocusTracker._signals[id]
    }
    private updateSignal(id?: string): void {
        if (id && FocusTracker._signals[id]) {
            const oldValue = FocusTracker._signals[id]()
            const newValue = this.hasFocus(id)
            if (oldValue !== newValue) {
                FocusTracker._signals[id].set(newValue)
            }
        }
    }
    dispose(id: string): void {
        if (FocusTracker._signals[id]) {
            delete FocusTracker._signals[id]
        }
        this.clearFocus(id)
    }
}
