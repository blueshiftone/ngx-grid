import { IGridEventsFactory } from '../events/grid-events.service'
import { ICellOperationFactory, IColumnOperationFactory, IGridDataSource, IGridOperationFactory, IRowOperationFactory } from '../typings/interfaces'
import { GridControllerService } from './grid-controller.service'
import { GridSelectionController } from './selection/grid-selection.controller'

export abstract class Operation {

    private _controller: GridControllerService

    constructor(controller: GridControllerService) {
        this._controller = controller
    }

    protected get gridEvents()      : IGridEventsFactory      { return this._controller.gridEvents }
    protected get columnOperations(): IColumnOperationFactory { return this._controller.column }
    protected get cellOperations()  : ICellOperationFactory   { return this._controller.cell }
    protected get gridOperations()  : IGridOperationFactory   { return this._controller.grid }
    protected get rowOperations()   : IRowOperationFactory    { return this._controller.row }
    protected get selection()       : GridSelectionController { return this._controller.selection }
    public    get dataSource()      : IGridDataSource         { return this._controller.dataSource }
    
    public onDestroy?(): void
}
