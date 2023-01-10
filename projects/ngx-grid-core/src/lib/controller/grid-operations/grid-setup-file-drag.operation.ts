import { fromEvent, Subject, Subscription } from 'rxjs'
import { distinctUntilChanged, filter, pairwise, startWith, takeUntil } from 'rxjs/operators'

import { IGridOperationFactory } from '../../typings/interfaces'
import { FileCellType } from '../../ui/cell/cell-types/file.cell-type'
import { FindParentOfClass } from '../../utils/find-parent-element-of-class'
import { Operation } from '../operation.abstract'

export class GridSetupFileDrag extends Operation {

  private _subscriptions = new Set<Subscription>()

  constructor(factory: IGridOperationFactory) { super(factory.gridController) }

  public run(): void {

    const uploads = this.controller.uploads;
    const addSubscription = (s: Subscription) => this._subscriptions.add(s)
    const dragState       = () => this.gridEvents.GridFileDragStateChangedEvent.state
    const dragoverStream  = new Subject<HTMLElement>();
    const dragStopped     = this.gridEvents.GridFileDragStateChangedEvent.on().pipe(filter(state => state === false))
    let fileCell: FileCellType | null = null
    let dragCounter = 0

    addSubscription(fromEvent<DragEvent>(window.document.documentElement, 'dragleave').subscribe(_ => {
      dragCounter--
      if (dragCounter === 0) this.gridEvents.GridFileDragStateChangedEvent.emit(false)
    }))

    addSubscription(fromEvent<DragEvent>(window.document, 'drop').subscribe(e => {
      e.preventDefault()
      e.stopPropagation()
      this.gridEvents.GridFileDragStateChangedEvent.emit(false)
      dragCounter = 0
      fileCell?.hoverStop()
      if (e.dataTransfer?.files && e.dataTransfer.files.length > 0 && fileCell) {
        this.gridEvents.GridFileUploadCreatedEvent.emit(uploads.createUpload(e.dataTransfer.files, fileCell.coordinates, this.dataSource.dataGridID))
        fileCell.receiveValue();
        fileCell = null;
       }
    }))

    addSubscription(fromEvent(window.document, 'dragover').subscribe(e => e.preventDefault()))

    addSubscription(fromEvent<DragEvent>(window.document.documentElement, 'dragenter').subscribe(e => {
      
      e.preventDefault()
      
      dragCounter++
      
      const numFiles = [...(e.dataTransfer?.items ?? [])].filter(item => item.kind === 'file').length

      if (numFiles > 0) {
        if (!dragState()) {

          this.gridEvents.GridFileDragStateChangedEvent.emit(true)

          const cellTypeComponents = new Set<FileCellType>()

          this.cellOperations.CellComponents.getAll().forEach(c => {
            if (c.typeComponent instanceof FileCellType) {
              cellTypeComponents.add(c.typeComponent)
              c.typeComponent.dragStart()
            }
          })

          const dragoverStreamSubscription = dragoverStream
            .pipe(
              distinctUntilChanged(),
              startWith(null),
              pairwise(),
              takeUntil(dragStopped))
            .subscribe(elements => {
              const [ prevType, nextType ] = elements.map(el => {
                const cellEl = FindParentOfClass('cell', el)
                if (!cellEl) return null
                const cellComponent = this.cellOperations.CellComponents.findForElement(cellEl)
                if (!cellComponent) return null
                if (cellComponent.typeComponent instanceof FileCellType) return cellComponent.typeComponent as FileCellType
                return null
              })

              if (prevType === nextType) return
              fileCell = nextType
              nextType?.hoverStart()
              prevType?.hoverStop()
            })
          
          addSubscription(dragoverStreamSubscription)

          dragoverStreamSubscription.add(() => {
            cellTypeComponents.forEach(c => c.dragStop())
            fileCell?.dragStop()
          })

        }

        dragoverStream.next(e.target as HTMLElement)
      }
    }))

  }

  public override onDestroy() {
    this._subscriptions.forEach(s => s.unsubscribe())
  }

}
