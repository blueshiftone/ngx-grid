import { IColumnOperationFactory } from '../../typings/interfaces/grid-column-operation-factory.interface'

export abstract class BaseColumnOperation {

  protected get gridEvents        () { return this.columnOperations.gridEvents }
  protected get cellOperations() { return this.columnOperations.gridController.cell }
  protected get gridOperations() { return this.columnOperations.gridController.grid }
  protected get rowOperations () { return this.columnOperations.gridController.row }
  protected get selection     () { return this.columnOperations.gridController.selection }

  constructor(protected readonly columnOperations: IColumnOperationFactory) {}

  public onDestroy?(): void

}
