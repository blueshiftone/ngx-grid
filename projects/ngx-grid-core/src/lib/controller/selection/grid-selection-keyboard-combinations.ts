import { IKeyCombination } from "../../typings/interfaces/key-combination.interface"

export const GridSelectionKeyboardCombinations: IKeyCombination[] = [
  {
    combination: 'ArrowUp',
    ignoreAllModifiers: true,
    swallowEvents: true,
  },
  {
    combination: 'ArrowRight',
    ignoreAllModifiers: true,
    swallowEvents: true,
  },
  {
    combination: 'ArrowDown',
    ignoreAllModifiers: true,
    swallowEvents: true,
  },
  {
    combination: 'ArrowLeft',
    ignoreAllModifiers: true,
    swallowEvents: true,
  },
  {
    combination: 'PageUp',
    ignoreShiftModifier: true,
    swallowEvents: true,
  },
  {
    combination: 'PageDown',
    ignoreShiftModifier: true,
    swallowEvents: true,
  },
  {
    combination: 'Home',
    ignoreAllModifiers: true,
    swallowEvents: true,
  },
  {
    combination: 'End',
    ignoreAllModifiers: true,
    swallowEvents: true,
  },
  {
    combination: 'Ctrl+A',
    swallowEvents: true
  },
  {
    combination: 'Tab',
    ignoreShiftModifier: true
  },
  {
    combination: 'Enter'
  },
  {
    combination: 'Space',
    swallowEvents: true
  }
]
