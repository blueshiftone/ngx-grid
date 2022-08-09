import { IGridCellComponent, IGridSelectionRange } from '../../typings/interfaces'
import { ICellOperationFactory } from '../../typings/interfaces/grid-cell-operation-factory.interface'
import { Operation } from '../operation.abstract'

export class SetCellSelectionClasses extends Operation {
  
  constructor(factory: ICellOperationFactory) { super(factory.gridController) }

  public run(cell: IGridCellComponent, selection?: IGridSelectionRange | null): void {  
    
    if (typeof selection === 'undefined') selection = this.selection.latestSelection()
    
    const { coordinates }          = cell
    const isSelected          = selection?.includes(coordinates)
    const edges               = selection?.edgesOf(coordinates)
    const edgesSecondary      = selection?.secondarySelection?.edgesOf(coordinates)
    const isSelectedSecondary = selection?.secondarySelection?.includes(coordinates) === true
    const isSubtracting       = selection?.secondarySelection?.isSubtracting         === true && isSelectedSecondary
    const isOverlapping       = selection?.secondarySelection?.includes(coordinates) === true || isSubtracting

    cell.toggleClass('selected',     isSelected == true)
    cell.toggleClass('subtracting',  isSubtracting)
    cell.toggleClass('multi-cells',  (selection?.cellCount ?? 0) > 1)
    cell.toggleClass('multi-select', selection?.multiSelect === true)

    cell.toggleClass('top-edge',    edges?.top === true)
    cell.toggleClass('right-edge',  edges?.right === true)
    cell.toggleClass('bottom-edge', edges?.bottom === true)
    cell.toggleClass('left-edge',   edges?.left === true)

    cell.toggleClass('overlapping-selection',   isOverlapping)
    cell.toggleClass('overlapping-top-edge',    isOverlapping && edgesSecondary?.top === true)
    cell.toggleClass('overlapping-right-edge',  isOverlapping && edgesSecondary?.right === true)
    cell.toggleClass('overlapping-bottom-edge', isOverlapping && edgesSecondary?.bottom === true)
    cell.toggleClass('overlapping-left-edge',   isOverlapping && edgesSecondary?.left === true)

  }

  public clear(cells: IGridCellComponent[] | Set<IGridCellComponent>): void {
    const classes = [ 'selected', 'subtracting', 'multi-select', 'top-edge', 'right-edge', 'bottom-edge', 'left-edge', 'overlapping-selection', 'overlapping-top-edge', 'overlapping-right-edge', 'overlapping-bottom-edge', 'overlapping-left-edge' ]
    cells.forEach(cell => classes.forEach(className => cell.toggleClass(className, false)))
  }

}
