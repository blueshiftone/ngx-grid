import { IFieldSortConfig, IGridCellCoordinates, IGridCellVisibilityBounds } from '../../typings/interfaces'
import { IGridOperationFactory } from '../../typings/interfaces/grid-operation-factory.interface'
import { Operation } from '../operation.abstract'

export class GetCellVisibility extends Operation {

  public static sortBy: IFieldSortConfig | null = null

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
      const rowHeight = this.gridOperations.GetGridElementSizes.getRowHeight()
      const thumbWidth = this.gridOperations.GetGridElementSizes.getThumbWidth()
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
      const cellTopBound        = cellComponent.rowComponent.index * rowHeight
      const cellBottomBound     = cellTopBound + cellHeight
      const cellLeftBound       = cellComponent.element.offsetLeft
      const cellRightBound      = cellLeftBound + cellWidth
      const cellClippedTop      = cellTopBound < viewportTopBound
      const cellClippedBottom   = cellBottomBound > viewportBottomBound
      const cellClippedRight    = cellRightBound > viewportRightBound
      const cellClippedLeft     = (cellLeftBound - thumbWidth) < viewportLeftBound
      
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
