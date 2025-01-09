import { EMetadataType } from '../../typings/enums'
import { IGridCellCoordinates, IGridColumn, IGridDataType, INumberOptions } from '../../typings/interfaces'
import { ICellOperationFactory } from '../../typings/interfaces/grid-cell-operation-factory.interface'
import { NumberOptionsParser } from '../../utils/number-format-parser/number-options-parser'
import { ParseDate } from '../../utils/parse-date-string'
import { ParseDateTime } from '../../utils/parse-datetime-string'
import { Operation } from '../operation.abstract'

export class GetFormattedValue extends Operation {

  constructor(factory: ICellOperationFactory) { super(factory.gridController) }

  public getPlainText(coords: IGridCellCoordinates, value?: any): string
  public getPlainText(column: IGridColumn, value?: any): string
  public getPlainText(coordsOrColumn: IGridCellCoordinates | IGridColumn, value?: any): string
  {
    return this._handleOverload(coordsOrColumn, value, false)
  }

  public getHTML(coords: IGridCellCoordinates, value?: any): string
  public getHTML(column: IGridColumn, value?: any): string
  public getHTML(coordsOrColumn: IGridCellCoordinates | IGridColumn, value?: any): string
  {
    return this._handleOverload(coordsOrColumn, value, true)
  }

  private _isCoordinates(coordsOrColumn: IGridCellCoordinates | IGridColumn): coordsOrColumn is IGridCellCoordinates {
    return coordsOrColumn.hasOwnProperty('rowKey')
  }

  private _isColumn(coordsOrColumn: IGridCellCoordinates | IGridColumn): coordsOrColumn is IGridColumn {
    return coordsOrColumn.hasOwnProperty('columnKey') && coordsOrColumn.hasOwnProperty('dropdownMenu')
  }

  private _handleOverload(coordsOrColumn: IGridCellCoordinates | IGridColumn, value: any, html: boolean): string {
    if (this._isColumn(coordsOrColumn)) {
      return this._run(coordsOrColumn, value, html)
    } else if (this._isCoordinates(coordsOrColumn)) {
      return this._run(coordsOrColumn, value, html)
    }
    throw new Error('Invalid argument')
  }

  private _run(coords: IGridCellCoordinates, value: any, returnHtml: boolean): string
  private _run(column: IGridColumn, value: any, returnHtml: boolean): string
  private _run(coordsOrColumn: IGridCellCoordinates | IGridColumn, value: any, returnHtml: boolean): string
  {
    
    let dataType: IGridDataType = { name: 'Text' }

    let numberOptions: INumberOptions | null = null

    if (this._isColumn(coordsOrColumn)) { // is IGridColumn

      const column = coordsOrColumn
      
      dataType = column.type ?? dataType

      numberOptions = column.metadata.get(EMetadataType.NumberOptions)

    } else if (this._isCoordinates(coordsOrColumn)) { // is IGridCellCoordinates

      const coords = coordsOrColumn

      value = value ?? this.cellOperations.GetCellValue.run(coords)?.value

      dataType = this.cellOperations.GetCellType.run(coords)

      numberOptions = this.cellOperations.GetCellMetaValue.run<INumberOptions>(coords, EMetadataType.NumberOptions)

      if (dataType.name === 'Text') {
        const valueLocalizationKey = this.cellOperations.GetCellMetaValue.run<string>(coords, EMetadataType.ValueLocalizationKey)
        if (valueLocalizationKey !== null) {
          const localizedValue = this.controller.localize.getLocalizedString(valueLocalizationKey)
          if (localizedValue !== valueLocalizationKey) return localizedValue
        }
      }
    }
    
    if (value === null || value === undefined) return ''    
    
    switch (dataType.name) {
      case 'NumberRange':
      case 'Number':
        if (numberOptions && numberOptions.formatString) {
          numberOptions = {...numberOptions}
          if (!returnHtml) {
            // Remove spacer chars from format string
            // Spacer char is any character following an _, e.g. _-
            // This is done to prevent the number format parser from
            // interpreting spacer chars as part of the format string when outputting plaintext
            numberOptions.formatString = numberOptions.formatString?.replace(/_[^_]/g, '')
          }
          let numbers: number[] = []
          if (Array.isArray(value)) {
            numbers = value
          } else {
            numbers.push(value)
          }
          const formatter = NumberOptionsParser.getParser(numberOptions)
          if (returnHtml) {
            return numbers.map(n => formatter.getHtml(n)).join(' — ')
          } else {
            return numbers.map(n => formatter.getPlainText(n)).join(' — ')
          }
        }
        break
      case 'Date':
        const date = typeof value === 'string' ? ParseDate(value) : value
        if (date) {
          const formattedDate = this.controller.datePipe.transform(date, this._dateFormat)
          if (formattedDate) return formattedDate
        }
        break
      case 'DateTime':
        const dateTime = typeof value === 'string' ? ParseDateTime(value) : value
        if (dateTime) {
          const formattedDateTime = this.controller.datePipe.transform(dateTime, this._dateTimeFormat)
          if (formattedDateTime) return formattedDateTime
        }
        break
      case 'File':
        if (typeof value === 'object' && value !== null && value.fileName !== undefined) return value.fileName
        break
      case 'DropdownSingleSelect':
        const gridId = dataType.list?.relatedGridID
        if (gridId) return this.gridOperations.GetRelatedDataPreviewString.run(gridId, value)
        else console.warn(`DropdownSingleSelect column ${coordsOrColumn.columnKey} has no related grid ID in its data type`)
        break
      case 'DropdownMultiSelect':
        if (Array.isArray(value)) {
          const gridId = dataType.list?.relatedGridID
          if (gridId) return value.map(v => this.gridOperations.GetRelatedDataPreviewString.run(gridId, v)).join(', ')
          else console.warn(`DropdownMultiSelect column ${coordsOrColumn.columnKey} has no related grid ID in its data type`)
        }
        break
        case 'RichText':
          if (!returnHtml) {
            const doc = new DOMParser().parseFromString(value, 'text/html')
            return doc.body.innerText
          }
          break
    }
    return value.toString()
  }

  private get _dateFormat(): string {
    return this.controller.getDateFormat()
  }

  private get _dateTimeFormat(): string {
    return this.controller.getDateTimeFormat()
  }

}
