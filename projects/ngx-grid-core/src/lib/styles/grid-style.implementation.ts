import { IGridColor } from '../typings/interfaces'
import { IGridStyle } from '../typings/interfaces/grid-style.interface'
import { GridColor } from './grid-color.implementation'
import { EGridStyle } from './grid-style.enum'

/* eslint-disable @typescript-eslint/naming-convention */
export class GridStyle implements IGridStyle {

    public backgroundColor?: IGridColor

    private _gridStyles: { [key in keyof typeof EGridStyle]: () => void } = {
        Good: () => {
            this.backgroundColor = GridColor.good()
        },
        Bad: () => {
            this.backgroundColor = GridColor.bad()
        },
        Neutral: () => {
            this.backgroundColor = GridColor.neutral()
        },
        Normal: () => {},
    }

    constructor(public style: EGridStyle) {
        const key = EGridStyle[style] as keyof typeof EGridStyle
        this._gridStyles[key]()
    }

    public static fromKey(key: keyof typeof EGridStyle)
    {
        return new GridStyle(EGridStyle[key])
    }

}
