import { ISelectionController } from '../../../typings/interfaces'

export class GetLastColumnIndex {

  constructor(private readonly controller: ISelectionController) { }

  public run(): number {
    return this.controller.gridController.dataSource.columns.length - 1
  }

}
