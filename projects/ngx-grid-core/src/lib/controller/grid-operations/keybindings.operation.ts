import { fromEvent, Subscription } from 'rxjs'

import { IGridKeyboardEvent } from '../../typings/interfaces'
import { IGridOperationFactory } from '../../typings/interfaces/grid-operation-factory.interface'
import { Operation } from '../operation.abstract'
import { IKeyCombination } from '../../typings/interfaces/key-combination.interface'
import { IKeyboardShortcut } from '../../typings/interfaces/keyboard-shortcut.interface'
import { GridControllerService } from '../grid-controller.service'
import { DefaultKeyboardShortcuts } from '../default-keyboard-shortcuts'
import { GridSelectionKeyboardCombinations } from '../selection/grid-selection-keyboard-combinations'

export class KeyBindings extends Operation {

  private readonly subscriptions: Set<Subscription> = new Set()

  private readonly blacklistActiveElements = ['input', 'textarea', 'select']
  
  constructor(factory: IGridOperationFactory) { super(factory.gridController) }

  public run(): void {
    const allKeys = new Map<string, IKeyCombination>()
    const actionMap = new Map<string, (controller: GridControllerService) => void>()
    const addKeyboardShortcuts = (shortcuts: IKeyboardShortcut[]) => {
      for (const shortcut of shortcuts) {
          if (!Array.isArray(shortcut.key)) {
              allKeys.set(shortcut.key.combination.toLowerCase(), shortcut.key)
              if (shortcut.action) actionMap.set(shortcut.key.combination.toLowerCase(), shortcut.action)
          } else {
              for (const key of shortcut.key) {
                  allKeys.set(key.combination.toLowerCase(), key)
                  if (shortcut.action) actionMap.set(key.combination.toLowerCase(), shortcut.action)
              }
          }
      }
    }
    addKeyboardShortcuts(GridSelectionKeyboardCombinations.map<IKeyboardShortcut>(combination => ({key: combination})))
    addKeyboardShortcuts(DefaultKeyboardShortcuts)
    addKeyboardShortcuts(this.dataSource.keyboardShortcuts ?? [])

    this.subscriptions.add(fromEvent<KeyboardEvent>(document.documentElement, 'keydown').subscribe(e => {
      if (!this.gridOperations.HasGridFocus.run() || this._documentHasEditableFocus || this.gridOperations.GetIsDisabled.run()) return
      for (const [_, key] of allKeys) {
        const combination = key.combination.toLowerCase()
        if (isKey(key, e)) {
          // Emit the event
          this.gridEvents.GridKeyCmdPressedEvent.emit({
            key: combination,
            hasCtrlKey: e.ctrlKey || e.metaKey,
            hasShiftKey: e.shiftKey
          })
          // Stop propagation to parents and to browser if `swallowEvents` is true
          if (key.swallowEvents) {
            e.preventDefault()
            e.stopPropagation()
          }
          // Invoke action if it exists in `actionMap`
          if (actionMap.has(combination.toLowerCase())) {
            actionMap.get(combination.toLowerCase())?.(this.controller)
          }
        }
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
    tab       :(input?: Partial<IGridKeyboardEvent>) => this.emitKeyCmd('Tab', input),
    space     :(input?: Partial<IGridKeyboardEvent>) => this.emitKeyCmd('Space', input),
    ctrlA     :(input?: Partial<IGridKeyboardEvent>) => this.emitKeyCmd('Ctrl+A', input)
  }

  public emitKeyCmd(key: string, input?: Partial<IGridKeyboardEvent>) {
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

const isKey = (key: IKeyCombination, e: KeyboardEvent): boolean => {
  let combination = key.combination.toLowerCase()
  const ctrlModiferOk = key.ignoreAllModifiers || key.ignoreCtrlModifier || (e.ctrlKey == combination.includes('ctrl+'))
  const shiftModiferOk = key.ignoreAllModifiers || key.ignoreShiftModifier || (e.shiftKey == combination.includes('shift+'))
  const altModiferOk = key.ignoreAllModifiers || key.ignoreAltModifier || (e.altKey == combination.includes('alt+'))
  if (!ctrlModiferOk || !shiftModiferOk || !altModiferOk) return false 
  if (e.code.toLowerCase().replace(/^key([a-z])/g, '$1') === combination.replace(/(ctrl|shift|alt)\+/g, '')) return true
  return false
}
