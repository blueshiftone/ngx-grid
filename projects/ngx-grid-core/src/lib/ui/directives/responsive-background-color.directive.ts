import { Directive, ElementRef, Input, OnInit } from '@angular/core'

import { TGridUITheme } from '../../typings/interfaces'
import { ColorBrightness } from '../../utils/color-brightness'

@Directive({
  selector: '[dataGridResponsiveBackgroundColor]'
})
export class ResponsiveBackgroundColorDirective implements OnInit {

  // eslint-disable-next-line @typescript-eslint/naming-convention
  @Input() public dataGridResponsiveBackgroundColor?: IResponsiveBackgroundColorConfig

  constructor(
    private readonly elRef: ElementRef<HTMLElement>
  ) {}

  ngOnInit(): void {
    const color = this.dataGridResponsiveBackgroundColor?.color
    const theme = this.dataGridResponsiveBackgroundColor?.themeMode
    if (typeof color !== 'undefined' && typeof theme !== 'undefined') {
      const brightness = ColorBrightness(color, theme)
      this._style.backgroundColor = color
      if (brightness?.mode !== 'default') {
        this._style.color = brightness?.mode === 'light' ? 'var(--dark-text)' : 'var(--light-text)'
      }
    }
  }

  private get _style(): CSSStyleDeclaration {
    return this.elRef.nativeElement.style
  }

}

export interface IResponsiveBackgroundColorConfig {
  color?: string
  themeMode: TGridUITheme
}
