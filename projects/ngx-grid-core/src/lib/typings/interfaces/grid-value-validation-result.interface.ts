
export interface IGridValueValidationResult<T = any> {
  value    : T
  message  : string
  severity : EValidationSeverity
  passed  : boolean
  failed: boolean
}

export enum EValidationSeverity {
  Error,
  Warning
}
