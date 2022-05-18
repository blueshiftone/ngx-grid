import { GridControllerService } from '../../../../../controller/grid-controller.service'
import { IGridCellCoordinates, IGridValueParsingResult } from '../../../../../typings/interfaces'
import { TAtLeast } from '../../../../../typings/types/at-least.type'
import { IParsingTest } from './parsing-test.interface'

export abstract class BaseParser implements IParsingTest {
  public abstract run(gridController: GridControllerService, cellCoords: TAtLeast<IGridCellCoordinates, 'columnKey'>): IGridValueParsingResult
  public abstract readonly initialValue: any

  public return(isValid: boolean, transformedValue: any = undefined): IGridValueParsingResult {
    const { initialValue } = this
    const isInvalid = !isValid
    if (isValid && transformedValue === undefined) transformedValue = initialValue
    return { initialValue, isInvalid, isValid, transformedValue, }
  }

  public passed(transformedValue: any = undefined): IGridValueParsingResult {
    return this.return(true, transformedValue)
  }

  public failed(transformedValue: any = undefined): IGridValueParsingResult {
    return this.return(false, transformedValue)
  }

}
