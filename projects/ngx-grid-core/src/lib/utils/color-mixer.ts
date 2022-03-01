import { IRGBA } from './color-brightness'

export class ColorMixer {

  private readonly darkBase  = 'rgba(43, 45, 49, #)'
  private readonly lightBase = 'rgba(250, 250, 250, #)'

  private readonly color: IRGBA

  constructor(color: IRGBA) {
    this.color = color
  }

  public lighten(percent: number) {
    return this.mix(this.lightBase.replace('#', this._clamp(percent).toString()))
  }

  public darken(percent: number) {
    return this.mix(this.darkBase.replace('#', this._clamp(percent).toString()))
  }

  // Draw colors on canvas and extract pixel value
  public mix(color2: string): IRGBA {
    const color1 = this._rgb
    const c       = document.createElement("canvas") 
    c.width  = 10
    c.height = 10
    const ctx = c.getContext("2d")!
        
    ctx.fillStyle = color1
    ctx.fillRect(0, 0, 10, 10)

    ctx.fillStyle = color2
    ctx.fillRect(0, 0, 10, 10)
    
    const data = ctx.getImageData(1, 1, 1, 1).data

    let   [r, g, b, a] = data
    const rgba: IRGBA  = { r, g, b, a: a / 255 }
    return rgba
  }

  private _clamp(n: number) {
    return Math.max(0.01, Math.min(0.99, n))
  }

  private get _rgb() {
    return `rgb(${this.color.r}, ${this.color.g}, ${this.color.b})`
  }

}
