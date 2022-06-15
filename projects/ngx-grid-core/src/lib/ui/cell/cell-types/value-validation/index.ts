import { MaxLength } from './cell-validators'

/* eslint-disable @typescript-eslint/naming-convention */
export const validators = {
  MaxLength,
}

export type TValidatorClass = typeof validators[keyof typeof validators]
