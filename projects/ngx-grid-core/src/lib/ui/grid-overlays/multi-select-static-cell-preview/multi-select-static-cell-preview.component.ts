import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, OnInit } from '@angular/core'

import { GRID_OVERLAY_DATA } from '../../../services/grid-overlay-service.service'
import { EPositionPreference } from '../../../typings/enums'
import { EGridOverlayType } from '../../../typings/enums/grid-overlay-type.enum'
import { IGridOverlayData, IGridSelectListOption } from '../../../typings/interfaces'
import { TPrimaryKey } from '../../../typings/types'
import { DeleteFromArray } from '../../../utils/array-delete'
import { BasePreviewComponent } from '../base-grid-preview-overlay.component'

@Component({
  selector: 'data-grid-multi-select-static-cell-preview',
  templateUrl: './multi-select-static-cell-preview.component.html',
  styleUrls: [ './multi-select-static-cell-preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MultiSelectStaticCellPreviewComponent extends BasePreviewComponent implements OnInit {

  public options: IGridSelectListOption[] = []
  public totalOptionsCount  = 0

  private _selectIsOpen = false
  private _listIsOpen   = false

  constructor(
    @Inject(GRID_OVERLAY_DATA) public override data: IGridOverlayData,
    public  override cd                            : ChangeDetectorRef,
    private readonly elREf                         : ElementRef<HTMLElement>
  ) {
    super(data, cd)
  }

  override ngOnInit(): void {
    this._setValue()
    this.addSubscription(this.data.currentCell.valueChanged.subscribe(_ => this._setValue()))
  }

  private _setValue() {
    const values = this.data.currentCell.value
    this.options.length = 0
    for (const val of values ?? []) {
      const option = this._getOption(val)
      if (option && this.options.length < 2) this.options.push(option)
    }
    this.totalOptionsCount = (values ?? []).length
    this.cd.detectChanges()
  }

  public async select(): Promise<void> {
    if (this._selectIsOpen) return
    this._selectIsOpen = true
    const overlay = this.overlayService.open(this.data.currentCell, EGridOverlayType.StaticDropdownOverlay, {
      flexibleDimensions: true,
      positionPreference: EPositionPreference.VerticalBottom,
      referenceElement: this.elREf.nativeElement,
    })
    await overlay.afterClosed
    this._selectIsOpen = false
  }

  public remove(item: IGridSelectListOption): void {
    const values: TPrimaryKey[] = (this.cell.value ?? [])    
    DeleteFromArray(values, item.value)
    this.updateValue(values.length ? values : null)
  }

  public async expand(): Promise<void> {
    if (this._listIsOpen) return
    this._listIsOpen = true
    const overlay = this.overlayService.open(this.cell, EGridOverlayType.MultiSelectStaticListOverlay, {
      data: this.data.customData,
      positionPreference: EPositionPreference.HorizontalRight,
      referenceElement: this.elREf.nativeElement,
    })
    
    await overlay.afterClosed

    this._listIsOpen = false
  }

  private _getOption(val: TPrimaryKey): IGridSelectListOption | undefined {
    return this.data.currentCell.type.list?.staticOptions?.find(op => op.value === val)
  }

  public get defaultColor(): string | undefined {
    return this.data.currentCell.type.list?.color
  }

}
