/* eslint-disable @typescript-eslint/naming-convention */
import * as CellValidatorClasses from '.'
import { EMetadataType } from '../../../../../typings/enums'

export type TCellValidators = typeof CellValidatorClasses[keyof typeof CellValidatorClasses]

export const CellValidatorMap: Partial<{ [ key in keyof typeof EMetadataType ]: TCellValidators[] }> = {
  MaxLength: [ CellValidatorClasses.MaxLength ],
}
