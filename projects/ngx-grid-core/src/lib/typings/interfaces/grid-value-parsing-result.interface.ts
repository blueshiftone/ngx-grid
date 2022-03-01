
export interface IGridValueParsingResult<T = any> {
  initialValue    : any
  transformedValue: T
  isValid         : boolean
  isInvalid       : boolean
}
