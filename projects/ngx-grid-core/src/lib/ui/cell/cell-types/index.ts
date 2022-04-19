import { BooleanCellType as Boolean } from './boolean.cell-type'
import { DateCellType as Date } from './date.cell-type'
import { DropdownMultiSelectCellType as DropdownMultiSelect } from './dropdown-multi-select.cell-type'
import { DropdownSingleSelectCellType as DropdownSingleSelect } from './dropdown-single-select.cell-type'
import { FileCellType as File } from './file.cell-type'
import { MoneyCellType as Money } from './money.cell-type'
import { NumberCellType as Number } from './number.cell-type'
import { PercentCellType as Percent } from './percent.cell-type'
import { RichTextCellType as RichText } from './rich-text.cell-type'
import { TextCellType as Text } from './text.cell-type'

/* eslint-disable @typescript-eslint/naming-convention */
const CELL_TYPES = {
  Boolean,
  Text,
  RichText,
  Money,
  Number,
  Date,
  Percent,
  DropdownSingleSelect,
  DropdownMultiSelect,
  File,
}

export default CELL_TYPES
