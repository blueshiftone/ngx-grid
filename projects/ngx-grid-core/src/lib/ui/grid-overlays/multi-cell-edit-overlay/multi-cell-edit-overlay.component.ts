import { ChangeDetectionStrategy, Component, ElementRef, Inject, OnInit } from '@angular/core'

import { GRID_MULTI_CELL_EDIT } from '../../../services/grid-multi-cell-edit.service'
import { IGridCellComponent } from '../../../typings/interfaces'

@Component({
  selector: 'data-grid-multi-cell-edit-overlay',
  templateUrl: './multi-cell-edit-overlay.component.html',
  styleUrls: ['./multi-cell-edit-overlay.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MultiCellEditOverlayComponent implements OnInit {

  constructor(
    @Inject(GRID_MULTI_CELL_EDIT) public cell: IGridCellComponent,
    private readonly elRef: ElementRef<HTMLElement>
  ) { }

  ngOnInit(): void {
    this.elRef.nativeElement.appendChild(this.cell.element)
    window.requestAnimationFrame(_ => {
      this.cell.startEdit()
      const { name } = this.cell.type
      if (name === 'RichText' || name === 'DropDownMultiSelect') {
        this.cell.startEdit() // calling StartEdit() a second time opens the editor
      }
    })
  }

}
