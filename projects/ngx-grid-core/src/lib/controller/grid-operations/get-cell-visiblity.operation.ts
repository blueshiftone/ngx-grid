import { IGridCellCoordinates, IGridCellVisibilityBounds, IGridSorted } from '../../typings/interfaces'
import { IGridOperationFactory } from '../../typings/interfaces/grid-operation-factory.interface'
import { Operation } from '../operation.abstract'

export class GetCellVisibility extends Operation {

  public static sortBy: IGridSorted | null = null

  constructor(factory: IGridOperationFactory) { super(factory.gridController) }
    
  public run(cellPos: IGridCellCoordinates): IGridCellVisibilityBounds {    

    const { viewPort } = this.gridOperations
    
    const cellComponent = this.cellOperations.CellComponents.findWithCoords(cellPos)
    if (typeof cellComponent === 'undefined' || typeof viewPort === 'undefined') {
      return  {
        clippedLeft   : true,
        clippedRight  : true,
        clippedTop    : true,
        clippedBottom : true,
        isClipped     : true,
        isFullyVisible: false,
      }
    } else {
      const leftScrollOffset    = viewPort.measureScrollOffset('left')
      const topScrollOffset     = viewPort.measureScrollOffset('top')
      const viewportWidth       = viewPort.getElementRef().nativeElement.clientWidth
      const viewportHeight      = viewPort.getElementRef().nativeElement.clientHeight
      const viewportTopBound    = topScrollOffset
      const viewportBottomBound = topScrollOffset + viewportHeight
      const viewportLeftBound   = leftScrollOffset
      const viewportRightBound  = leftScrollOffset + viewportWidth
      const cellWidth           = cellComponent.element.clientWidth
      const cellHeight          = cellComponent.element.clientHeight
      const cellTopBound        = cellComponent.rowComponent.index * 25 // 25 is row height
      const cellBottomBound     = cellTopBound + cellHeight
      const cellLeftBound       = cellComponent.element.offsetLeft
      const cellRightBound      = cellLeftBound + cellWidth
      const cellClippedTop      = cellTopBound < viewportTopBound
      const cellClippedBottom   = cellBottomBound > viewportBottomBound
      const cellClippedRight    = cellRightBound > viewportRightBound
      const cellClippedLeft     = (cellLeftBound - 22) < viewportLeftBound // 22 is the size of row thumb
      
      return  {
        clippedLeft   : cellClippedLeft,
        clippedRight  : cellClippedRight,
        clippedTop    : cellClippedTop,
        clippedBottom : cellClippedBottom,
        isClipped     : cellClippedLeft || cellClippedRight || cellClippedTop || cellClippedBottom,
        isFullyVisible: !cellClippedLeft && !cellClippedRight && !cellClippedTop && !cellClippedBottom,
      }
    }

  }

}


