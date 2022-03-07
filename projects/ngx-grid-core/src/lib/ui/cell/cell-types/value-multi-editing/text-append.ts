import { TCellTypeName } from '../../../../typings/types/cell-type-name.type'
import { StringParser } from '../value-parsing/parsers/string.parser'
import { BaseMultiEdit } from './base-multi-edit.abstract'

export class TextAppend extends BaseMultiEdit {
  constructor(cellValue: any, cellType: TCellTypeName) { super(cellValue, cellType) }
  public label = 'locAppendText'
  public run   = (input: any) => {
    const valueTest   = new StringParser(this.cellValue).run()
    const valueString = valueTest.isValid ? valueTest.transformedValue : ''
    const inputTest   = new StringParser(input).run()
    const inputString = inputTest.isValid ? inputTest.transformedValue : ''
    let newValue = ''
    if (valueString === '') {
      this.setCellValue(inputString)
      return
    }
    if (!inputString) return
    if (this.cellType === 'RichText') {
      const node = document.createElement('div')
      node.innerHTML = valueString
      if (node.childElementCount > 0) {
        node.lastElementChild!.append(inputString)
        newValue = node.innerHTML
      }
    }
    if (!newValue) newValue = `${valueString}${inputString}`
    this.setCellValue(newValue)
  }
}
