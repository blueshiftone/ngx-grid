import { GridControllerService } from '../controller/grid-controller.service'
import { EMetadataType } from '../typings/enums'
import { IGridSelectionSlice } from '../typings/interfaces'
import { GridCellCoordinates } from '../typings/interfaces/implementations'

export class ExcelFormatter {

  private readonly currencySymbol: string

  private readonly csvDelimiter = '\t'

  constructor(
    private readonly gridController: GridControllerService,
    private readonly selectionSlice: IGridSelectionSlice
  ) {
    this.currencySymbol = this.gridController.localize.getLocalizedString('$')
  }

  public toPlainText() {

    const cells = this.selectionSlice.cellsFormatted 

    const plain = cells.map((row, rowIndex) => {
      return row.map((cellValue, colIndex) => this._formatValAsPlain(cellValue, colIndex, rowIndex)).join(this.csvDelimiter)
    }).join('\r\n')

    return plain

  }

  public toExcelHTML() {

    const cells = this.selectionSlice.cellsFormatted

    return `
    <table>
      ${this.selectionSlice.columnKeys.map(key => `<col width="${this.gridController.column.GetColumnWidth.run(key)}" style='mso-width-source:userset;width:${this.gridController.column.GetColumnWidth.run(key)}px'>`).join('\r\n')}
      ${cells.map((row, rowIndex) => {
        return `<tr>${row.map((cell, colIndex) => this._formatValAsHTML(cell ?? '', colIndex, rowIndex)).join('')}</tr>`
      }).join('\n')}
    </table>`

  }

  private _formatValAsHTML(value: any, colIndex: number, rowIndex: number): string {
    const columnKey   = this.selectionSlice.columnKeys[colIndex]
    const rowKey      = this.selectionSlice.rowKeys[rowIndex]
    const coords      = new GridCellCoordinates(rowKey, columnKey)
    const cellType    = this.gridController.cell.GetCellType.run(coords)
    const columnWidth = this.gridController.column.GetColumnWidth.run(columnKey)
    
    if (cellType.name === 'RichText') { // convert html to plain text
      const node = document.createElement('div')
      node.innerHTML = value
      this._replaceBlockNodes(node) as HTMLDivElement
      value = node.innerHTML
    }

    let msoNumberFormat = ``
    let styles: string[] = []

    switch (cellType.name) {
      case 'RichText' :
        const node = document.createElement('div')
        node.innerHTML = value
        this._replaceBlockNodes(node) as HTMLDivElement
        value = node.innerHTML
      break
      case 'File' :
        value = value?.fileName ?? ''
      break
      case 'Number': 
        const numberFormatString = this.gridController.cell.GetCellMetaValue.run<string>(coords, EMetadataType.NumberFormatString)
        if (numberFormatString) {
          if (numberFormatString.includes('%')) {
            msoNumberFormat = '0%'
          }
          else if (numberFormatString.includes(this.currencySymbol)) {
            msoNumberFormat = `"_-\\0022${this.currencySymbol}\\0022* \\#\\,\\#\\#0\\.00_-\\;\\\\-\\0022${this.currencySymbol}\\0022* \\#\\,\\#\\#0\\.00_-\\;_-\\0022${this.currencySymbol}\\0022* \\0022-\\0022??_-\\;_-\\@_-"`;
          }
        }
        if (msoNumberFormat === '') msoNumberFormat = `Fixed`; 
      break
      case 'Date': 
        msoNumberFormat = `"Short Date"`; 
      break
    }

    if (msoNumberFormat) styles.push(`mso-number-format:${msoNumberFormat}`)

    styles.push(`width:${columnWidth}px`)

    return `<td${styles.length ? ` style='${styles.join(';')}'` : ``}${ columnWidth !== null ? ` width="${columnWidth}"` : '' }>${value}</td>`
  }

  private _formatValAsPlain(value: any, colIndex: number, rowIndex: number): string {
    value = value ?? ''
    const columnKey = this.selectionSlice.columnKeys[colIndex]
    const rowKey    = this.selectionSlice.rowKeys[rowIndex]
    const cellType  = this.gridController.cell.GetCellType.run(new GridCellCoordinates(rowKey, columnKey))
    
    if (cellType.name === 'RichText') { // convert html to plain text
      const div = document.createElement('div')
      div.innerHTML = value ?? ''
      value = div.innerText.replace(/\r|\n/g, '')
    }

    if (cellType.name === 'File') {
      value = value?.fileName ?? ''
    }
    
    if (Array.isArray(value)) value = value.join(',')

    if (
      (typeof value === 'string' && (value.includes(this.csvDelimiter) || value.includes('\r') || value.includes('\n'))) 
      || typeof value === 'object'
    ) {
      value = JSON.stringify(value)
    }

    return value
  }

  private _replaceBlockNodes(node: Node): Node {
    const lineBreak = `<br style="mso-data-placement:same-cell;" />`
    node.childNodes.forEach(node => {
      if (node.nodeType === 1 ) {
        const el = node as HTMLElement
        const tagName = el.tagName.toLowerCase()
        const isSmallBlockElement = smallBlockElements.includes(tagName)
        const isLargeBlockElement = largeBlockElements.includes(tagName)
        if (isSmallBlockElement || isLargeBlockElement) {
          const replacement = document.createElement('span')
          for (const attr of el.attributes) replacement.setAttribute(attr.name, attr.value)
          let breaks = ''
          if (this._nodeHasNextSibling(el)) {
            if (isSmallBlockElement) breaks = lineBreak
            else breaks = `${lineBreak}${lineBreak}`
          }
          replacement.innerHTML = `${el.innerHTML}${breaks}`
          el.replaceWith(replacement)
        }
        this._replaceBlockNodes(el)
      }
    })
    return node
  }

  private _nodeHasNextSibling(node: Node): boolean {
    if (node.nextSibling !== null) return true
    if (!node.parentNode) return false
    return this._nodeHasNextSibling(node.parentNode)
  }

}

const smallBlockElements = [
  'address', 'article', 'aside', 'details', 'dialog', 'dd', 'div', 'dl', 'dt',
  'fieldset', 'figcaption', 'figure', 'footer', 'form', 'br',
  'header', 'hr', 'li', 'main', 'nav', 'pre', 'section'
]

const largeBlockElements = [
  'blockquote', 
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 
  'hgroup', 'ol', 'p', 'table', 'ul'
]
