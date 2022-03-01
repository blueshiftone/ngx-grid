import { TGridCmdKeys } from '../../controller/grid-operations/keybindings.operation'

export interface IGridKeyboardEvent {
  key        : TGridCmdKeys
  valueOfKey?: string
  hasShiftKey: boolean
  hasCtrlKey : boolean
}
