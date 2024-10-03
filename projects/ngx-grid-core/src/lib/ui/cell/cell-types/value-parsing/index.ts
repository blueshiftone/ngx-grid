import { ICellValueParser } from '../../../../typings/interfaces'
import { TCellTypeName } from '../../../../typings/types/cell-type-name.type'
import * as parsers from './parsers'
import { ValueParser } from './value-parser'

export type TValueParserClass = typeof parsers[keyof typeof parsers]

export const CELL_VALUE_PARSERS: {[key in TCellTypeName]: ICellValueParser} = {
  File                : new ValueParser([parsers.File]),
  Boolean             : new ValueParser([parsers.Boolean]),
  Text                : new ValueParser([parsers.String]),
  RichText            : new ValueParser([parsers.String]),
  Color               : new ValueParser([parsers.String, parsers.Color]),
  Number              : new ValueParser([parsers.Number]),
  Date                : new ValueParser([parsers.Date]),
  DropdownSingleSelect: new ValueParser([parsers.MultiSelect]),
  DropdownMultiSelect : new ValueParser([parsers.Array, parsers.MultiSelect]),
  DateRange           : new ValueParser([parsers.Array]),
  NumberRange         : new ValueParser([parsers.Array]),
  Button              : new ValueParser([parsers.Button]),
  Icon                : new ValueParser([parsers.Icon]),
}
