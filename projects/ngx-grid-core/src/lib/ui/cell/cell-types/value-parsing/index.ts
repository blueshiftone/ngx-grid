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
  Money               : new ValueParser([parsers.Number]),
  Number              : new ValueParser([parsers.Number]),
  Date                : new ValueParser([parsers.Date]),
  Percent             : new ValueParser([parsers.Number]),
  DropdownSingleSelect: new ValueParser([parsers.MultiSelect]),
  DropdownMultiSelect : new ValueParser([parsers.Array, parsers.MultiSelect]),
}
