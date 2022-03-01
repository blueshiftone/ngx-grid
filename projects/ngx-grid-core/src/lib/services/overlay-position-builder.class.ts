import {
  ConnectedPosition,
  FlexibleConnectedPositionStrategy,
  Overlay,
  OverlayPositionBuilder as OverlayPositionBuilderAngular,
} from '@angular/cdk/overlay'

import { EPositionPreference } from '../typings/enums/position-preference.enum'

export class OverlayPositionBuilder {

  private _positionBuilder: OverlayPositionBuilderAngular
  private _positionStrategy?: FlexibleConnectedPositionStrategy

  private readonly positionPreferenceOptions: { [key in 'topStart' | 'topCenter' | 'bottomCenter' | 'right' | 'left' | 'bottomStart' | 'centered']: ConnectedPosition } = {
    topStart    : { originX: 'start',  originY: 'top',    overlayX: 'start',  overlayY: 'bottom' },
    topCenter   : { originX: 'center', originY: 'top',    overlayX: 'center', overlayY: 'bottom' },
    bottomCenter: { originX: 'center', originY: 'top',    overlayX: 'center', overlayY: 'bottom' },
    right       : { originX: 'end',    originY: 'top',    overlayX: 'start',  overlayY: 'top' },
    bottomStart : { originX: 'start',  originY: 'bottom', overlayX: 'start',  overlayY: 'top' },
    left        : { originX: 'start',  originY: 'top',    overlayX: 'start',  overlayY: 'top' },
    centered    : { originX: 'center', originY: 'center', overlayX: 'center', overlayY: 'center' },
  }

  constructor(overlay: Overlay) {
    this._positionBuilder = overlay.position()
  }

  public connectedToElement(e: HTMLElement) {
    this._positionStrategy = this._positionBuilder.flexibleConnectedTo(e)
    return this
  }

  public connectedToCoords(coords: { x: number, y: number }) {
    this._positionStrategy = this._positionBuilder.flexibleConnectedTo(coords)
    return this
  }

  public withPosition(pos: EPositionPreference) {
    this._positionStrategy = this._getPosStrategy()
    const positions: ConnectedPosition[] = []
    const options = this.positionPreferenceOptions
    switch (pos) {
      case EPositionPreference.HorizontalLeft : positions.push(options.left, options.right, options.bottomStart, options.topStart); break
      case EPositionPreference.HorizontalRight: positions.push(options.right, options.left, options.bottomStart, options.topStart); break
      case EPositionPreference.VerticalTop    : positions.push(options.topStart, options.bottomStart, options.left, options.right); break
      case EPositionPreference.TopCentered    : positions.push(options.topCenter, options.bottomCenter, options.left, options.right); break
      case EPositionPreference.Centered       : positions.push(options.centered, options.bottomStart, options.right, options.topStart, options.left); break
      case EPositionPreference.VerticalBottom : default: positions.push(options.bottomStart, options.topStart, options.left, options.right)
    }
    this._positionStrategy = this._positionStrategy.withPositions(positions)
    return this
  }

  public withFlexibleDimensions(flexible = true) {
    if (flexible) {
      this._positionStrategy = this._getPosStrategy()
      this._positionStrategy = this._positionStrategy.withFlexibleDimensions()
    }
    return this
  }

  public get positionStrategy() { return this._getPosStrategy() }

  private _getPosStrategy = () => this._positionStrategy ?? this._positionBuilder.flexibleConnectedTo({ x: 0, y: 0 })

}
