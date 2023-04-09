export interface IButtonCellValue {
  text: string
  action: (coords: {
    rowKey: string | number
    columnKey: string
    compositeKey: string
  }) => void
}
