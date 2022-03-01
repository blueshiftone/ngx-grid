import { IRowOperationFactory } from '../../typings/interfaces/grid-row-operation-factory.interface'

export abstract class BaseRowOperation {

  protected get gridEvents      () { return this.rowOperations.gridEvents }
  protected get cellOperations  () { return this.rowOperations.gridController.cell }
  protected get columnOperations() { return this.rowOperations.gridController.column }
  protected get gridOperations  () { return this.rowOperations.gridController.grid }
  protected get selection       () { return this.rowOperations.gridController.selection }

constructor(protected readonly rowOperations: IRowOperationFactory) {}

  public onDestroy?(): void

}
