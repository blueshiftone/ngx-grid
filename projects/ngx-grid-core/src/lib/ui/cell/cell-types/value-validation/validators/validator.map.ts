/* eslint-disable @typescript-eslint/naming-convention */
import * as ValidatorClasses from '.'
import { EMetadataType } from '../../../../../typings/enums'

export type TValidators = typeof ValidatorClasses[keyof typeof ValidatorClasses]

export const ValidatorMap: Partial<{ [ key in keyof typeof EMetadataType ]: TValidators[] }> = {
  MaxLength: [ ValidatorClasses.MaxLength ]
}
