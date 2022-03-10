import { ChangeDetectionStrategy, Component, ElementRef, Input, OnInit } from '@angular/core'

import { IGridSeparator } from '../../typings/interfaces'

@Component({
  selector: 'data-grid-separator',
  template: '',
  styleUrls: ['./separator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SeparatorComponent implements OnInit {

  @Input() public separator?: IGridSeparator
  @Input() public axis      : 'x' | 'y' = 'y'

  constructor(
    private readonly elRef: ElementRef<HTMLElement>
  ) { }

  ngOnInit(): void {
    if (!this.separator) return
    this._el.classList.add(this.axis)
    this._el.classList.add(this.separator.position)
    if (this.separator.color) this._el.style.backgroundColor = this.separator.color
    if (this.separator.thickness) {
      if (this._isXAxis) this._el.style.height = `${this.separator.thickness}px`
      if (this._isYAxis) this._el.style.width  = `${this.separator.thickness}px`
    }
  }

  private get _el(): HTMLElement { return this.elRef.nativeElement } 

  private get _isXAxis(): boolean { return this.axis === 'x' }
  private get _isYAxis(): boolean { return this.axis === 'y' }

}
