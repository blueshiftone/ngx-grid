import { ChangeDetectionStrategy, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core'
import { FormControl } from '@angular/forms'
import { fromEvent } from 'rxjs'

import { GRID_MULTI_CELL_INPUT, IMultiCellInputConfigs } from '../../../services/grid-multi-cell-edit.service'
import { AutoUnsubscribe } from '../../../utils/auto-unsubscribe'

@Component({
  selector: 'data-grid-multi-cell-edit-input',
  templateUrl: './multi-cell-edit-input.component.html',
  styleUrls: ['./multi-cell-edit-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MultiCellEditInputComponent extends AutoUnsubscribe implements OnInit {

  @ViewChild('input', { static: true }) public inputEl!: ElementRef<HTMLInputElement>

  public ctrl = new FormControl()

  constructor (
    @Inject(GRID_MULTI_CELL_INPUT) public configs: IMultiCellInputConfigs,
  ) { super() }

  ngOnInit(): void {
    this.focus()
    this.addSubscription(fromEvent<KeyboardEvent>(this.inputEl.nativeElement, 'keydown').subscribe(e => {
      switch(e.key.toLowerCase()) {
        case 'enter':
          e.stopImmediatePropagation()
          this.configs.value = this.ctrl.value       
          this.configs.close()
        break
        case 'escape':
          e.stopImmediatePropagation()
          this.configs.close()
        break
      }
    }))
  }

  public focus() {
    window.requestAnimationFrame(_ => {
      this.inputEl.nativeElement.focus()
    })
  }

}
