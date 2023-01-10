import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core'

import { GRID_OVERLAY_DATA } from '../../../services/grid-overlay-service.service'
import { EPositionPreference } from '../../../typings/enums'
import { EGridOverlayType } from '../../../typings/enums/grid-overlay-type.enum'
import { IGridOverlayData, IGridSelectListOption } from '../../../typings/interfaces'
import { TPrimaryKey } from '../../../typings/types'
import { DeleteFromArray } from '../../../utils/array-delete'
import { BaseOverlayComponent } from '../base-grid-overlay.component'

@Component({
  selector: 'data-grid-multi-select-static-list-overlay',
  templateUrl: './multi-select-static-list-overlay.component.html',
  styleUrls: ['./multi-select-static-list-overlay.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MultiSelectStaticListOverlayComponent extends BaseOverlayComponent implements OnInit {

  @ViewChild ('AddBtn', {read: ElementRef}) public addBtn?: ElementRef<HTMLButtonElement>

  public options: IGridSelectListOption[] = []

  private _selectIsOpen = false

  constructor(
    @Inject(GRID_OVERLAY_DATA) public override data: IGridOverlayData,
    public  override cd                            : ChangeDetectorRef,
    private readonly elREf                         : ElementRef<HTMLElement>
  ) {
    super(data, cd)
  }

  override ngOnInit(): void {
    this._setOptions();
    this.addSubscription(this.data.currentCell.valueChanged.subscribe(_ => {
      this._setOptions()
    }))
    this.addSubscription(this.gridController.localize.changes.subscribe(_ => this.cd.detectChanges()))
  }

  private _setOptions(): void {
    this.options.length = 0
    for (const val of this.data.currentCell.value ?? []) {
      const option = this._getOption(val)
      if (option) this.options.push(option)
    }     
    this.cd.detectChanges()
  }

  public async select(): Promise<void> {
    if (this._selectIsOpen) return
    this._selectIsOpen = true
    const overlay = this.overlayService.open(this.data.currentCell, EGridOverlayType.StaticDropdownOverlay, {
      flexibleDimensions: true,
      positionPreference: EPositionPreference.VerticalBottom,
      referenceElement  : this.addBtn?.nativeElement ?? this.elREf.nativeElement,
    }, this.cellViewContainerRef)
    await overlay.afterClosed
    this._selectIsOpen = false
  }

  public remove(item: IGridSelectListOption): void {
    const values: TPrimaryKey[] = (this.cell.value ?? [])    
    DeleteFromArray(values, item.value)
    this.updateValue(values)
  }

  private _getOption(val: TPrimaryKey): IGridSelectListOption | undefined {
    return this.data.currentCell.type.list?.staticOptions?.find(op => op.value === val)
  }

  public get defaultColor(): string | undefined {
    return this.data.currentCell.type.list?.color
  }

}
