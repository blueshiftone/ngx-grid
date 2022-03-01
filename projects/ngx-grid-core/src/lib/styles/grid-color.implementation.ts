import { IGridColor } from '../typings/interfaces'

export class GridColor implements IGridColor {

  constructor (private _color: TRGB) {}

  public static colors = {
    bad    : [255, 94, 94],
    good   : [100, 235, 49],
    neutral: [255, 230, 20],
  }

  public static good(): GridColor {
    return new GridColor(this.colors.good as TRGB);
  }
  public static bad(): GridColor {
    return new GridColor(this.colors.bad as TRGB);
  }
  public static neutral(): GridColor {
    return new GridColor(this.colors.neutral as TRGB);
  }

  public toString(alpha: number = 0.70): string {
    return `rgba(${this._color.join(', ')}, ${alpha})`
  }

}

type TRGB = [
  number,
  number,
  number
]
