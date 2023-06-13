import { BooleanCellType as Boolean } from './boolean.cell-type'
import { ColorCellType as Color } from './color.cell-type'
import { DateRangeCellType as DateRange } from './date-range.cell-type'
import { DateCellType as Date } from './date.cell-type'
import { DropdownMultiSelectCellType as DropdownMultiSelect } from './dropdown-multi-select.cell-type'
import { DropdownSingleSelectCellType as DropdownSingleSelect } from './dropdown-single-select.cell-type'
import { FileCellType as File } from './file.cell-type'
import { NumberRangeCellType as NumberRange } from './number-range.cell-type'
import { NumberCellType as Number } from './number.cell-type'
import { RichTextCellType as RichText } from './rich-text.cell-type'
import { TextCellType as Text } from './text.cell-type'
import { ButtonCellType as Button } from './button.cell-type'

/* eslint-disable @typescript-eslint/naming-convention */
const CELL_TYPES = {
  Boolean,
  Text,
  RichText,
  Number,
  NumberRange,
  Date,
  DateRange,
  DropdownSingleSelect,
  DropdownMultiSelect,
  File,
  Color,
  Button
}

export default CELL_TYPES
