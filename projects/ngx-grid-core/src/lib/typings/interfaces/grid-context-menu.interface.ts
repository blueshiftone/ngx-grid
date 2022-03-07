import { IGridContextMenuItem } from '.'
import { LocalizationService } from '../../services/localization.service'


export interface IGridContextMenu {
  loc: LocalizationService
  items: IGridContextMenuItem[]
}
