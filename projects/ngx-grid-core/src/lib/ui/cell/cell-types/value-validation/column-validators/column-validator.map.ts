import * as ColumnValidatorClasses from '.'
import { EMetadataType } from '../../../../../typings/enums'

/* eslint-disable @typescript-eslint/naming-convention */
export type TColumnValidators = typeof ColumnValidatorClasses[keyof typeof ColumnValidatorClasses]

export const ColumnValidatorMap: Partial<{ [ key in keyof typeof EMetadataType ]: TColumnValidators[] }> = {
  IsUnique: [ ColumnValidatorClasses.IsUnique ],
  ExactlyOneRecordWithValue: [ ColumnValidatorClasses.ExactlyOneRecordWithValue ],
}
