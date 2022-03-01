import { GridSelectionController } from '../../controller/selection/grid-selection.controller'

export interface IGridSelectionStrategy {
  controller: GridSelectionController
  
  attach(el: HTMLElement): void
}
