import { ICellValueParser } from '../../../../typings/interfaces'
import { TCellTypeName } from '../../../../typings/types/cell-type-name.type'
import { Array, Boolean, Date, File, MultiSelect, Number, String } from './parsers'
import { ValueParser } from './value-parser'

/* eslint-disable @typescript-eslint/naming-convention */
const parsers = {
  Array,
  Boolean,
  Date,
  String,
  File,
  Number,
  MultiSelect,
}

export type TValueParserClass = typeof parsers[keyof typeof parsers]

export const CELL_VALUE_PARSERS: {[key in TCellTypeName]: ICellValueParser} = {
  File                : new ValueParser([File]),
  Boolean             : new ValueParser([Boolean]),
  Text                : new ValueParser([String]),
  RichText            : new ValueParser([String]),
  Money               : new ValueParser([Number]),
  Number              : new ValueParser([Number]),
  Date                : new ValueParser([Date]),
  Percent             : new ValueParser([Number]),
  DropdownSingleSelect: new ValueParser([MultiSelect]),
  DropdownMultiSelect : new ValueParser([Array, MultiSelect]),
}
