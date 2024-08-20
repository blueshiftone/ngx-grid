import { Component, OnDestroy } from '@angular/core'
import { Subscription } from 'rxjs'

/*
  This class removes some boilerplace for unsubsbcribing from observables when a component is destroyed.

  ngOnDestroy is an Angular lifecyle hook

  Use as a component extension (... extends AutoUnsubscribe ...)

  Call AddSubscription when subscribing to an observable i.e. this.AddSubscription(Observable.subscribe(...))

  Implement appOnDestroy for custom OnDestroy logic
*/

@Component({ template: '', host: {'ngx-grid': '1'} })
// eslint-disable-next-line @angular-eslint/component-class-suffix
export abstract class AutoUnsubscribe implements OnDestroy {
  private readonly subscriptions: Set<Subscription> = new Set()
  protected addSubscription = (s: Subscription) => { this.subscriptions.add(s) }
  public appOnDestroy?(): void
  private _unsubscribeAll = () => { this.subscriptions.forEach(s => s.unsubscribe()) }
  public ngOnDestroy() {
    this._unsubscribeAll()
    this.appOnDestroy?.()
  }
}
