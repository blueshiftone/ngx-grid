import { EMetadataType } from '../../typings/enums'
import { IGridDataSource } from '../../typings/interfaces'
import { IRowOperationFactory } from '../../typings/interfaces/grid-row-operation-factory.interface'
import { GridCellCoordinates } from '../../typings/interfaces/implementations/grid-cell-coordinates.implementation'
import { TPrimaryKey } from '../../typings/types'
import { Operation } from '../operation.abstract'

export class GetRowPreviewString extends Operation {

  constructor(factory: IRowOperationFactory) { super(factory.gridController) }

  public run(rowKey: TPrimaryKey, source: IGridDataSource = this.dataSource): string {
    
    const row = source.getRow(rowKey)
    
    if (source.rowTemplateString === undefined) {
      console.error(`RowPreviewTemplateString not set for grid ${this.gridOperations.GetGridId.run()}`);
      return '(preview not available)'
    }
    
    if (!row) return (rowKey ?? '').toString()
    
    let output = source.rowTemplateString

    for (const col of source.columns) {

      const cellMeta = source.cellMeta.get(new GridCellCoordinates(row.rowKey, col.columnKey).compositeKey);

      const valueLocalizationKey = cellMeta?.metadata.get<string>(EMetadataType.ValueLocalizationKey)
      
      if (output.includes(col.columnKey)) {
        
        const regex = new RegExp(`\\{\\{(?:\\s+)?${col.columnKey}(?:\\s+)?\\}\\}`, 'g')
        
        let value: any
        let underlyingValue = row.getValue(col.columnKey)?.value
        
        // localize if a localization key is provided
        if (valueLocalizationKey !== null && valueLocalizationKey !== undefined) {

          value = this.controller.localize.getLocalizedString(valueLocalizationKey)

          // if the localization key was not expanded, fall back to the underlying value
          if (value === valueLocalizationKey) value = underlyingValue
          
        } else {

          value = underlyingValue

        }

        output = output.replace(regex, value)        
      }
    }

    return output
  }

}
