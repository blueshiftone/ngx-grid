import { Component, OnDestroy } from '@angular/core'
import { SubscriptionLike } from 'rxjs'

/*
  This class removes some boilerplace for unsubsbcribing from observables when a component is destroyed.

  ngOnDestroy is an Angular lifecyle hook

  Use as a component extension (... extends AutoUnsubscribe ...)

  Call AddSubscription when subscribing to an observable i.e. this.AddSubscription(Observable.subscribe(...))

  Implement appOnDestroy for custom OnDestroy logic
*/

@Component({ template: '' })
// eslint-disable-next-line @angular-eslint/component-class-suffix
export abstract class AutoUnsubscribe implements OnDestroy {
  private readonly subscriptions: Set<SubscriptionLike> = new Set()
  protected addSubscription = (s: SubscriptionLike) => { this.subscriptions.add(s) }
  protected appOnDestroy?(): void
  private _unsubscribeAll = () => { this.subscriptions.forEach(s => s.unsubscribe()) }
  public ngOnDestroy() {
    this._unsubscribeAll()
    this.appOnDestroy?.()
  }
}
