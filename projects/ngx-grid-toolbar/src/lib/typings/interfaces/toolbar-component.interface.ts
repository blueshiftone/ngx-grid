import { EToolbarItemPlacement } from '../enums/toolbar-item-placement.enum'

export interface IToolbarComponent {
  isVisible: boolean,
  isEnabled: boolean,
  sortOrder: number,
  placement: EToolbarItemPlacement
  element  : HTMLElement

  detectChanges(): void
}
