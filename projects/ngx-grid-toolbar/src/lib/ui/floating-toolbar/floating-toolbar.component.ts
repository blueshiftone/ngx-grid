import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core'
import { MatMenuTrigger } from '@angular/material/menu'
import { TPrimaryKey } from 'ngx-grid-core'

import { ToolbarService } from '../../toolbar.service'
import { AutoUnsubscribe } from '../../utils/auto-unsubscribe'

@Component({
  selector: 'data-grid-toolbar-floating-toolbar',
  templateUrl: './floating-toolbar.component.html',
  styleUrls: ['./floating-toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FloatingToolbarComponent extends AutoUnsubscribe implements OnInit {

  @ViewChild('multiEditButton') public multiEditButton?: ElementRef<HTMLElement>
  @ViewChild('multiEditMenuTrigger', {read: MatMenuTrigger}) public multiEditMenuTrigger?: MatMenuTrigger

  public canSetValues = false
  public canRevert    = false
  public canCommit    = false
  public canDelete    = true
  public multiEditorLabels: string[] = []

  constructor(
    public  readonly toolbarService : ToolbarService,
    private readonly elRef          : ElementRef<HTMLElement>,
    private readonly changeDetection: ChangeDetectorRef,
  ) { super() }

  ngOnInit(): void {
    this._init()
  }

  private async _init() {
    const controller = this.toolbarService.gridController
    if (!controller) return
    await controller.whenInitialised()
    const viewPort = controller.grid.viewPort
    if (!viewPort) return
    const el = viewPort.elementRef.nativeElement.parentElement
    if (!el) return
    el.prepend(this.elRef.nativeElement)
    this.canDelete = controller.grid.source().canDelete
    this.toolbarService.selectionSlice.subscribe(_ => this._checkChanges())
    if (this.toolbarService.gridController) {
      this.addSubscription(this.toolbarService.gridController.gridEvents.GridWasModifiedEvent.on().subscribe(_ => this._checkChanges()))
    }
  }

  public setValues(): void {
    const selection = this.toolbarService.selectionSlice.value?.selection
    if (!selection) return
    const distinctType = this.toolbarService.multiCellEditService?.getDistinctType(selection)
    if (distinctType && distinctType.type.name === 'Boolean') {
      this.multiEditMenuTrigger?.openMenu()
      return
    }
    this.toolbarService.multiCellEditService?.openValueEditor({
      strategy: 'element',
      element: this.multiEditButton?.nativeElement
    }, selection)
  }

  public runMultiEditor(label: string): void {

    const selection            = this.toolbarService.selectionSlice.value?.selection
    const multiCellEditService = this.toolbarService.multiCellEditService
    if (!selection || !multiCellEditService) return

    multiCellEditService.runMultiEditor(label, selection, {
      strategy: 'element',
      element: this.multiEditButton?.nativeElement
    })

  }

  public copySelection(): void {
    this.toolbarService.gridController?.selection.copySelection()
  }

  public deleteRecords(): void {
    for (const pk of this._selectedRowKeys) this.toolbarService.gridController?.row.DeleteRow.buffer(pk)
  }

  public clearSelection(): void {
    this.toolbarService.gridController?.selection.clearSelection()
  }

  private get _selectedRowKeys(): TPrimaryKey[] {
    return this.toolbarService.selectionSlice.value?.rowKeys ?? []
  }

  private _checkChanges(): void {
    const selection = this.toolbarService.selectionSlice.value?.selection
    const multiCellEditService = this.toolbarService.multiCellEditService
    if (selection && multiCellEditService) {
      const distinctType = multiCellEditService.getDistinctType(selection) 
      this.canSetValues = distinctType !== false
      if (distinctType) {
        this.multiEditorLabels = distinctType.editors.map(e => new e(null, distinctType.type.name)).map(editor => editor.label).reverse()
      }
    }
    this.changeDetection.detectChanges()
  }

}