import { BehaviorSubject, fromEvent, skip, SubscriptionLike, takeUntil } from 'rxjs'

import { IGridRowFloatingTitle } from '../../../typings/interfaces'

// We're writing a vanilla javascript component because we've detached Angular change detection at the row level, 
// and an Angular component would not be able to detect changes in the floating title.
export class RowFloatingTitleTSComponent {

  private _subs = new Set<SubscriptionLike>()

  private _element: HTMLDivElement
  private _icon: HTMLSpanElement
  private _txt: HTMLDivElement
  private _hover: HTMLDivElement

  private readonly floatingTitle: BehaviorSubject<IGridRowFloatingTitle>

  constructor(floatingTitle: IGridRowFloatingTitle) {

    this.floatingTitle = new BehaviorSubject(floatingTitle)

    this._icon = document.createElement('span')
    this._icon.classList.add('material-symbols-outlined')

    this._txt = document.createElement('div')
    this._txt.classList.add('txt')

    this._hover = document.createElement('div')
    this._hover.classList.add('hover')

    this._element = document.createElement('div')
    this._element.classList.add('row-floating-title')
    
    this._element.appendChild(this._icon)
    this._element.appendChild(this._txt)
    this._element.appendChild(this._hover)

    this._subs.add(this.floatingTitle.subscribe(floatingTitle => {
      const nextFloatingTitle = this.floatingTitle.pipe(skip(1))
      this._subs.add(floatingTitle.icon.pipe(takeUntil(nextFloatingTitle)).subscribe(icon => this._icon.textContent = icon))
      this._subs.add(floatingTitle.title.pipe(takeUntil(nextFloatingTitle)).subscribe(title => {
        if (!title) {
          this._txt.innerHTML = '<i style="opacity: 0.6">(empty)</i>'
        } else {
          this._txt.textContent = title
        }
      }))
    }))

    this._subs.add(fromEvent<MouseEvent>(this._element, 'click').subscribe(() => this.floatingTitle.value.action()))
  }

  public attachTo(toElement: HTMLElement) {
    toElement.appendChild(this._element)
  }

  public next(floatingTitle: IGridRowFloatingTitle) {
    this.floatingTitle.next(floatingTitle)
  }

  public destroy() {
    this._subs.forEach(sub => sub.unsubscribe())
    this._element.remove()
  }

}
