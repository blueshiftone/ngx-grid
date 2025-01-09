import { BooleanCellType as Boolean } from './boolean.cell-type'
import { ColorCellType as Color } from './color.cell-type'
import { DateRangeCellType as DateRange } from './date-range.cell-type'
import { DateCellType as Date } from './date.cell-type'
import { DateTimeCellType as DateTime } from './date-time.cell-type'
import { DropdownMultiSelectCellType as DropdownMultiSelect } from './dropdown-multi-select.cell-type'
import { DropdownSingleSelectCellType as DropdownSingleSelect } from './dropdown-single-select.cell-type'
import { FileCellType as File } from './file.cell-type'
import { NumberRangeCellType as NumberRange } from './number-range.cell-type'
import { NumberCellType as Number } from './number.cell-type'
import { RichTextCellType as RichText } from './rich-text.cell-type'
import { TextCellType as Text } from './text.cell-type'
import { ButtonCellType as Button } from './button.cell-type'
import { IconCellType as Icon } from './icon.cell-type'
import { FileSizeCellType as FileSize } from './file-size.cell-type'

/* eslint-disable @typescript-eslint/naming-convention */
const CELL_TYPES = {
  Boolean,
  Text,
  RichText,
  Number,
  NumberRange,
  Date,
  DateTime,
  DateRange,
  DropdownSingleSelect,
  DropdownMultiSelect,
  File,
  Color,
  Button,
  Icon,
  FileSize
}

export default CELL_TYPES
