import { OverlaySizeConfig } from '@angular/cdk/overlay'

import { EPositionPreference } from '../enums/position-preference.enum'

export interface IGridOverlayConfigs {
  flexibleDimensions?  : boolean
  positionPreference?  : EPositionPreference
  size?                : OverlaySizeConfig
  data?                : any
  referenceElement?    : HTMLElement
  hasBackdrop?         : boolean
  backdropClass?       : string
  backdropCloseOnClick?: boolean
}
