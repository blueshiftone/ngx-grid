import { IGridEventsFactory } from '../events/grid-events.service'
import {
  ICellOperationFactory,
  IColumnOperationFactory,
  IGridDataSource,
  IGridOperationFactory,
  IRowOperationFactory,
  ISelectionController,
} from '../typings/interfaces'
import { GridControllerService } from './grid-controller.service'

export abstract class Operation {

    public controller: GridControllerService

    constructor(controller: GridControllerService) {
        this.controller = controller
    }

    protected get gridEvents()      : IGridEventsFactory      { return this.controller.gridEvents }
    protected get columnOperations(): IColumnOperationFactory { return this.controller.column }
    protected get cellOperations()  : ICellOperationFactory   { return this.controller.cell }
    protected get gridOperations()  : IGridOperationFactory   { return this.controller.grid }
    protected get rowOperations()   : IRowOperationFactory    { return this.controller.row }
    protected get selection()       : ISelectionController    { return this.controller.selection }
    public    get dataSource()      : IGridDataSource         { return this.controller.dataSource }
    
    public onDestroy?(): void
}
