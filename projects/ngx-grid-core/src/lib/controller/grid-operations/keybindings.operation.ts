import { fromEvent, Subscription } from 'rxjs'

import { IGridKeyboardEvent } from '../../typings/interfaces'
import { IGridOperationFactory } from '../../typings/interfaces/grid-operation-factory.interface'
import { Operation } from '../operation.abstract'

const keysToCapture = [
  'Delete',
  'Backspace',
  'Enter',
  'ArrowLeft',
  'ArrowUp',
  'ArrowRight',
  'ArrowDown',
  'End',
  'Home',
  'PageUp',
  'PageDown',
  'Escape',
  'Tab',
  'Space',
  'Ctrl+A',
  'Ctrl+C',
] as const

export type TGridCmdKeys = typeof keysToCapture[number] | 'InputKey'

export class KeyBindings extends Operation {

  private readonly subscriptions: Set<Subscription> = new Set()

  private readonly blacklistActiveElements = ['input', 'textarea', 'select']
  
  constructor(factory: IGridOperationFactory) { super(factory.gridController) }

  public run(): void {
    this.subscriptions.add(fromEvent<KeyboardEvent>(document.documentElement, 'keydown').subscribe(e => {
      if (!this.gridOperations.HasGridFocus.run() || this._documentHasEditableFocus || this.gridOperations.GetIsDisabled.run()) return
      for (const key of keysToCapture) {
        if (isKey(key, e)) {
          this.gridEvents.GridKeyCmdPressedEvent.emit({
            key: key,
            hasCtrlKey: e.ctrlKey || e.metaKey,
            hasShiftKey: e.shiftKey
          })
          e.preventDefault()
          e.stopPropagation()
          return
        }
      }
      if (e.key.length === 1 && (!e.metaKey && !e.ctrlKey)) {
        this.gridEvents.GridKeypressedEvent.emit({
          key       : 'InputKey',
          valueOfKey: e.key,
          hasCtrlKey: e.ctrlKey || e.metaKey,
          hasShiftKey: e.shiftKey
        })
        e.preventDefault()
        e.stopPropagation()
        return
      }
    }))
  }
  
  public manualKeyboardTriggers = {
    enter     :(input?: Partial<IGridKeyboardEvent>) => this.emitKeyCmd('Enter', input),
    arrowLeft :(input?: Partial<IGridKeyboardEvent>) => this.emitKeyCmd('ArrowLeft', input),
    arrowUp   :(input?: Partial<IGridKeyboardEvent>) => this.emitKeyCmd('ArrowUp', input),
    arrowRight:(input?: Partial<IGridKeyboardEvent>) => this.emitKeyCmd('ArrowRight', input),
    arrowDown :(input?: Partial<IGridKeyboardEvent>) => this.emitKeyCmd('ArrowDown', input),
    end       :(input?: Partial<IGridKeyboardEvent>) => this.emitKeyCmd('End', input),
    home      :(input?: Partial<IGridKeyboardEvent>) => this.emitKeyCmd('Home', input),
    pageUp    :(input?: Partial<IGridKeyboardEvent>) => this.emitKeyCmd('PageUp', input),
    pageDown  :(input?: Partial<IGridKeyboardEvent>) => this.emitKeyCmd('PageDown', input),
    escape    :(input?: Partial<IGridKeyboardEvent>) => this.emitKeyCmd('Escape', input),
    tab       :(input?: Partial<IGridKeyboardEvent>) => this.emitKeyCmd('Tab', input),
    space     :(input?: Partial<IGridKeyboardEvent>) => this.emitKeyCmd('Space', input),
    ctrlA     :(input?: Partial<IGridKeyboardEvent>) => this.emitKeyCmd('Ctrl+A', input),
    ctrlC     :(input?: Partial<IGridKeyboardEvent>) => this.emitKeyCmd('Ctrl+C', input)
  }

  public emitKeyCmd(key: TGridCmdKeys, input?: Partial<IGridKeyboardEvent>) {
    const output: IGridKeyboardEvent = {
      key        : key,
      hasCtrlKey : input?.hasCtrlKey ?? false,
      hasShiftKey: input?.hasCtrlKey ?? false,
    }
    this.gridEvents.GridKeyCmdPressedEvent.emit(output)
  }

  public override onDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe())
  }

  private get _documentHasEditableFocus(): boolean {
    const activeEl = document.activeElement
    return activeEl &&
      (this.blacklistActiveElements.includes((activeEl.tagName || '').toLowerCase()) ||
        activeEl.hasAttribute('contenteditable')) || false
  }

}

const isKey = (k: string, e: KeyboardEvent): boolean => {
  k = k.toLowerCase()
  if (k.includes('ctrl+') && (e.ctrlKey || e.metaKey)) k = k.replace('ctrl+', '')
  if (e.code.toLowerCase().replace(/^key([a-z])/g, '$1') === k) return true
  return false
}
