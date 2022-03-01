import { ICellOperationFactory } from '../../typings/interfaces/grid-cell-operation-factory.interface'

export abstract class BaseCellOperation {

  protected get gridEvents      () { return this.cellOperations.gridEvents }
  protected get columnOperations() { return this.cellOperations.gridController.column }
  protected get gridOperations  () { return this.cellOperations.gridController.grid }
  protected get rowOperations   () { return this.cellOperations.gridController.row }
  protected get selection       () { return this.cellOperations.gridController.selection }

  constructor(protected readonly cellOperations: ICellOperationFactory) {}

  public onDestroy?(): void

}
