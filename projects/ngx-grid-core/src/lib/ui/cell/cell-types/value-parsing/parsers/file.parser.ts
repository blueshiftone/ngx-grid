import { IGridValueParsingResult } from '../../../../../typings/interfaces'
import { BaseParser } from './base-parser.abstract'
import { IParsingTest } from './parsing-test.interface'

export class FileParser extends BaseParser implements IParsingTest {
  constructor (public readonly initialValue: any) { super() }

  public run(): IGridValueParsingResult<any[]> {
    
    if (
      (
        !Array.isArray(this.initialValue) &&
        typeof this.initialValue === 'object' &&
        this.initialValue.fileName &&
        this.initialValue.fileSizeInBytes
      )
      || this.initialValue === null
    ) return this.passed()

    return this.failed()
  }
}
