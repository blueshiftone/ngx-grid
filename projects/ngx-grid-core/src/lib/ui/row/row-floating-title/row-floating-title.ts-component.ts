import { MatIconRegistry } from '@angular/material/icon'
import { BehaviorSubject, fromEvent, merge, SubscriptionLike, switchMap } from 'rxjs'

import { IGridRowFloatingTitle } from '../../../typings/interfaces'

// We're writing a vanilla javascript component because we've detached Angular change detection at the row level, 
// and an Angular component would not be able to detect changes in the floating title.
export class RowFloatingTitleTSComponent {

  private _subs = new Set<SubscriptionLike>()

  private _element: HTMLDivElement
  private _icon: HTMLDivElement
  private _txt: HTMLDivElement
  private _hover: HTMLDivElement

  private readonly floatingTitle: BehaviorSubject<IGridRowFloatingTitle>

  constructor(
    floatingTitle: IGridRowFloatingTitle,
    iconRegistry  : MatIconRegistry
  ) {

    this.floatingTitle = new BehaviorSubject(floatingTitle)

    this._icon = document.createElement('div')
    this._icon.classList.add('title-icon')
    this._icon.classList.add('mat-icon')

    this._txt = document.createElement('div')
    this._txt.classList.add('txt')

    this._hover = document.createElement('div')
    this._hover.classList.add('hover')

    this._element = document.createElement('div')
    this._element.classList.add('row-floating-title')
    
    this._element.appendChild(this._txt)
    this._element.appendChild(this._hover)

    this._subs.add(this.floatingTitle
      .pipe(
        switchMap(floatingTitle => floatingTitle.icon),
        switchMap(iconString => iconRegistry.getNamedSvgIcon(iconString)))
      .subscribe(iconSvgElement => {
        this._icon.replaceChildren(iconSvgElement)
    }))

    this._subs.add(this.floatingTitle
      .pipe(
        switchMap(floatingTitle => floatingTitle.title))
      .subscribe(title => {
        if (!title) {
          this._txt.innerHTML = '<i style="opacity: 0.6">(empty)</i>'
        } else {
          this._txt.textContent = title
        }
    }))

    this._subs.add(
      merge(fromEvent<MouseEvent>(this._element, 'click'), fromEvent<MouseEvent>(this._icon, 'click'))
      .subscribe(e => {
        e.stopPropagation()
        this.floatingTitle.value.action()
      }))

    this._subs.add(
      fromEvent<MouseEvent>(this._icon, 'mousedown')
      .subscribe(e => e.stopPropagation()))
  }

  public attachTo(toElement: HTMLElement) {
    toElement.append(this._element)
    toElement.querySelector('.row-thumb')?.append(this._icon)
  }

  public next(floatingTitle: IGridRowFloatingTitle) {
    this.floatingTitle.next(floatingTitle)
  }

  public destroy() {
    this._subs.forEach(sub => sub.unsubscribe())
    this._element.remove()
    this._icon.remove()
  }

}
