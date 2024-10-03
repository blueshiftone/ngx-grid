import * as editors from '.'
import { IValueMultiEdit } from '../../../../typings/interfaces'
import { TCellTypeName } from '../../../../typings/types/cell-type-name.type'

/* eslint-disable @typescript-eslint/naming-convention */
export const CELL_MULTI_EDITORS: {[key in TCellTypeName]: Array<new (cellValue: any, cellType: TCellTypeName) => IValueMultiEdit>} = {
  Boolean             : [ editors.BooleanCheck, editors.BooleanUncheck, editors.BooleanInvert ],
  Text                : [ editors.TextAppend, editors.TextPrepend, editors.ClearValues ],
  RichText            : [ editors.TextAppend, editors.TextPrepend, editors.ClearValues ],
  Number              : [ editors.NumberAdd, editors.NumberSubtract, editors.NumberDivide, editors.NumberMultiply, editors.ClearValues],
  Date                : [ editors.DateAddDays, editors.DateSubtractDays, editors.ClearValues ],
  NumberRange         : [ editors.ClearValues ],
  DateRange           : [ editors.ClearValues ],
  DropdownSingleSelect: [ editors.ClearValues ],
  DropdownMultiSelect : [ editors.ClearValues ],
  File                : [ editors.ClearValues ],
  Color               : [ editors.ClearValues ],
  Button              : [],
  Icon                : [],
}
