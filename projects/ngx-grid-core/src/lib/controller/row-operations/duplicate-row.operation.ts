import { IGridCellValue, IGridRow } from '../../typings/interfaces'
import { IRowOperationFactory } from '../../typings/interfaces/grid-row-operation-factory.interface'
import { Operation } from '../operation.abstract'
import { v4 as uuidv4 } from 'uuid'
import { BufferOperation } from '../buffer-operation'
import { ERowStatus } from '../../typings/enums'

export class DuplicateRow extends Operation {

    public bufferOperation = new BufferOperation(() => this._run())

    constructor(factory: IRowOperationFactory) { super(factory.gridController) }

    public buffer = () => this.bufferOperation.next()

    private async _run(): Promise<void> {
        const rows: IGridRow[] = []
        const latestSelection = this.selection.latestSelection()
        if (!latestSelection || !latestSelection.rows.size) return

        // Create cloned rows
        for (const rowkey of latestSelection.rowKeys ?? []) {
            const row = this.dataSource.getRow(rowkey)
            if (row) {
                const newRowKey = uuidv4()
                const newRow = row.clone(newRowKey)
                newRow.status = ERowStatus.New
                rows.push(newRow)
            }
        }

        // Assuming rows in latestSelection are always ordered sequentially?
        const lastRow = this.dataSource.getRow(latestSelection.rowKeys[latestSelection.rowKeys.length - 1])
        if (!lastRow) throw new Error('No last row')
        let rowToInsert = rows.pop()
        const cellValuesChanged: IGridCellValue[] = []
        const bufferedOperations: Promise<void>[] = []
        while (rowToInsert) {
            bufferedOperations.push(this.rowOperations.InsertRowAfter.run(rowToInsert, lastRow))
            for (const [_, value] of rowToInsert.values) {
                if (this.cellOperations.GetCellIsEditable.run(value)) {
                    cellValuesChanged.push(value)
                    bufferedOperations.push(this.cellOperations.SetCellDraftValue.buffer(value))
                }
            }
            rowToInsert = rows.pop()
        }
        await Promise.all(bufferedOperations)
        this.gridEvents.CellValueChangedEvent.emit(cellValuesChanged)
    }
}
