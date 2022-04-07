import { ISelectionController } from './selection-controller.interface'

export interface IGridSelectionStrategy {
  controller: ISelectionController
  
  attach(el: HTMLElement): void
}
