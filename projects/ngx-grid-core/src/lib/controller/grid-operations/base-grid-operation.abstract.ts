import { IGridOperationFactory } from '../../typings/interfaces/grid-operation-factory.interface'

export abstract class BaseGridOperation {

  protected get gridEvents      () { return this.gridOperations.gridEvents }
  protected get cellOperations  () { return this.gridOperations.gridController.cell }
  protected get columnOperations() { return this.gridOperations.gridController.column }
  protected get rowOperations   () { return this.gridOperations.gridController.row }
  protected get selection       () { return this.gridOperations.gridController.selection }

  constructor(protected readonly gridOperations: IGridOperationFactory) {}

  public onDestroy?(): void

}
