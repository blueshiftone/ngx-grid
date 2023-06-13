import { TLocalizationKey } from '../types'

export interface IGridValueValidationResult<T = any> {
  value       : T
  message     : TLocalizationKey
  severity    : EValidationSeverity
  passed      : boolean
  failed      : boolean
  nonBlocking?: boolean
  validatorId : any
}

export enum EValidationSeverity {
  Error,
  Warning
}
