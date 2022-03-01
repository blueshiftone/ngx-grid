import { ChangeDetectionStrategy, Component, ElementRef, Input, OnInit } from '@angular/core'

import { IGridSeperator } from '../../typings/interfaces'

@Component({
  selector: 'data-grid-seperator',
  template: '',
  styleUrls: ['./seperator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SeperatorComponent implements OnInit {

  @Input() public seperator?: IGridSeperator
  @Input() public axis      : 'x' | 'y' = 'y'

  constructor(
    private readonly elRef: ElementRef<HTMLElement>
  ) { }

  ngOnInit(): void {
    if (!this.seperator) return
    this._el.classList.add(this.axis)
    this._el.classList.add(this.seperator.position)
    if (this.seperator.color) this._el.style.backgroundColor = this.seperator.color
    if (this.seperator.thickness) {
      if (this._isXAxis) this._el.style.height = `${this.seperator.thickness}px`
      if (this._isYAxis) this._el.style.width  = `${this.seperator.thickness}px`
    }
  }

  private get _el(): HTMLElement { return this.elRef.nativeElement } 

  private get _isXAxis(): boolean { return this.axis === 'x' }
  private get _isYAxis(): boolean { return this.axis === 'y' }

}
