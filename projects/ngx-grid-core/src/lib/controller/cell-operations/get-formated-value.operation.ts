import { EMetadataType } from '../../typings/enums'
import { IGridCellCoordinates } from '../../typings/interfaces'
import { ICellOperationFactory } from '../../typings/interfaces/grid-cell-operation-factory.interface'
import { NumberFormatParser } from '../../utils/number-format-parser/number-format-parser'
import { ParseDate } from '../../utils/parse-date-string'
import { Operation } from '../operation.abstract'

export class GetFormattedValue extends Operation {

  constructor(factory: ICellOperationFactory) { super(factory.gridController) }

  public run(coords: IGridCellCoordinates, value?: any, returnHtml = true): string {
    value = value ?? this.cellOperations.GetCellValue.run(coords)?.value
    if (value === null || value === undefined) return ''
    const cellType = this.cellOperations.GetCellType.run(coords)
    switch (cellType.name) {
      case 'NumberRange':
      case 'Number':
        let formatString = this.cellOperations.GetCellMetaValue.run<string>(coords, EMetadataType.NumberFormatString)
        if (formatString) {
          if (!returnHtml) {
            // Remove spacer chars from format string
            // Spacer char is any character following an _, e.g. _-
            // This is done to prevent the number format parser from
            // interpreting spacer chars as part of the format string when outputting plaintext
            formatString = formatString.replace(/_[^_]/g, '')
          }
          let numbers: number[] = []
          if (Array.isArray(value)) {
            numbers = value
          } else {
            numbers.push(value)
          }
          const formatter = NumberFormatParser.getParser(formatString)
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
          const formattedDate = this.gridOperations.gridController.datePipe.transform(date, this._dateFormat)
          if (formattedDate) return formattedDate
        }
        break
      case 'File':
        if (typeof value === 'object' && value !== null && value.fileName !== undefined) return value.fileName
        break
      case 'DropdownSingleSelect':
        const gridId = cellType.list?.relatedGridID
        if (gridId) this.gridOperations.GetRelatedDataPreviewString.run(gridId, value)
        break
      case 'DropdownMultiSelect':
        if (Array.isArray(value)) {
          const gridId = cellType.list?.relatedGridID
          if (gridId) return value.map(v => this.gridOperations.GetRelatedDataPreviewString.run(gridId, v)).join(', ')
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
    const format = this.gridOperations.gridController.localize.getLocalizedString('dateFormat')
    return format === 'dateFormat' ? this.gridOperations.gridController.defaultDateFormat : format
  }

}
