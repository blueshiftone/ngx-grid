import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Inject, OnInit } from '@angular/core'
import { startWith, takeUntil } from 'rxjs/operators'

import { GRID_OVERLAY_DATA } from '../../../services/grid-overlay-service.service'
import { EPositionPreference } from '../../../typings/enums'
import { EGridOverlayType } from '../../../typings/enums/grid-overlay-type.enum'
import { IGridOverlayData } from '../../../typings/interfaces'
import { TPrimaryKey } from '../../../typings/types'
import { DeleteFromArray } from '../../../utils/array-delete'
import { BasePreviewComponent } from '../base-grid-preview-overlay.component'

@Component({
  selector: 'data-grid-multi-select-grid-cell-preview',
  templateUrl: './multi-select-grid-cell-preview.component.html',
  styleUrls: ['./multi-select-grid-cell-preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MultiSelectGridCellPreviewComponent extends BasePreviewComponent implements OnInit {

  public chips: {value: TPrimaryKey, label: string}[] = []
  public totalChipCount  = 0

  private _selectIsOpen = false
  private _listIsOpen   = false

  constructor(
    @Inject(GRID_OVERLAY_DATA) public override data: IGridOverlayData,
    public override cd: ChangeDetectorRef,
    private readonly elREf: ElementRef<HTMLElement>
  ) {
    super(data, cd)
  }

  override ngOnInit(): void {
    super.ngOnInit()

    this._setChips()
    
    this.addSubscription(this.data.currentCell.valueChanged.pipe(startWith()).subscribe(_ => {
      this._setChips()
      this.cd.detectChanges()
    }))
    
  }

  private _setChips(): void {
    const values: TPrimaryKey[] = (this.cell.value ?? []) 
    this.chips.length   = 0
    this.totalChipCount = values.length
    for (const primaryKey of values) {
      if (this.chips.length >= 2) break
      this.chips.push({
        value: primaryKey,
        label: this.gridController.grid.GetRelatedDataPreviewString.run(this.cell.type.list!.relatedGridID!, primaryKey).toString(),
      })
    }
  }

  public async select(): Promise<void> {
    if (this._selectIsOpen) return
    this._selectIsOpen = true
    const overlay = this.overlayService.open(this.data.currentCell, EGridOverlayType.MultiSelectForeignKeyDropdownOverlay, {
      flexibleDimensions: true,
      size: {
        width: 550,
        height: 300
      },
      positionPreference: EPositionPreference.VerticalBottom,
      referenceElement: this.elREf.nativeElement,
    })
    await overlay.afterClosed
    this._selectIsOpen = false
  }

  public remove(primaryKey: TPrimaryKey): void {
    const values: TPrimaryKey[] = (this.cell.value ?? [])    
    DeleteFromArray(values, primaryKey)
    this.updateValue(values.length ? values : null)
  }

  public async expand(): Promise<void> {
    if (this._listIsOpen) return
    this._listIsOpen = true
    const overlay = this.overlayService.open(this.cell, EGridOverlayType.MultiSelectGridSelectedList, {
      data: this.data.customData,
      positionPreference: EPositionPreference.HorizontalRight,
      referenceElement: this.elREf.nativeElement,
    })   

    const selectOutput = overlay.component.instance.selected as EventEmitter<void>
    this.addSubscription(selectOutput.pipe(takeUntil(overlay.overlayRef.detachments())).subscribe(_ => {
      this.select()
    }))
    
    await overlay.afterClosed

    this._listIsOpen = false
  }

  public get defaultColor(): string | undefined {
    return this.data.currentCell.type.list?.color
  }

}
