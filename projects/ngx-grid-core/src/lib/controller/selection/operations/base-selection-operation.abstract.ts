import { IGridSelectionState, ISelectionController } from '../../../typings/interfaces'

export abstract class BaseSelectionOperation {
  public get selectionState(): IGridSelectionState | null { return this._controller.state }
  constructor(private readonly _controller: ISelectionController) {}
}
