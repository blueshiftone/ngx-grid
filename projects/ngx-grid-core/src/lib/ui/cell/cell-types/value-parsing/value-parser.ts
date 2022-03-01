import { TValueParserClass } from '.'
import { GridControllerService } from '../../../../controller/grid-controller.service'
import { ICellValueParser, IGridCellCoordinates, IGridValueParsingResult } from '../../../../typings/interfaces'

export class ValueParser implements ICellValueParser {

  constructor(private readonly tests: TValueParserClass[]) {}

  public validate(
    value: any,
    gridController: GridControllerService,
    cellCoords: IGridCellCoordinates
  ): IGridValueParsingResult {

    const output: IGridValueParsingResult = {
      initialValue    : value,
      transformedValue: value,
      isInvalid       : false,
      isValid         : true
    }

    if (value === null) return output

    for (const test of this.tests) {
      const result = new test(output.transformedValue).run(gridController, cellCoords)
      if (result.isInvalid) return result
      Object.assign(output, result)
    }

    return output

  }

}
