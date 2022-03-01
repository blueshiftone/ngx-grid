import { EGridIcon } from '../../services/icon.service'

export interface IGridContextMenuItem {
  label    : string
  icon?    : EGridIcon
  children?: IGridContextMenuItem[]
  action?(e: MouseEvent): any
}
