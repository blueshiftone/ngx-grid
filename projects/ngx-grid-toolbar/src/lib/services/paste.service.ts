import { Injectable } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { BehaviorSubject, fromEvent, Subscription } from 'rxjs'
import { map, startWith } from 'rxjs/operators'

import { PasteDeniedDialogComponent } from '../ui/paste-denied-dialog/paste-denied-dialog.component'

@Injectable({
  providedIn: 'root'
})
export class PasteService {

  private _subscriptions = new Set<Subscription>()
  public state = new BehaviorSubject<PermissionState | 'grantedWithContent'>('prompt')
  public clipboardContents?: ClipboardItem

  constructor(
    private readonly dialog: MatDialog,
  ) {

    this._subscriptions.add(fromEvent<FocusEvent>(window, 'focus').pipe(map(_ => true), startWith(true)).subscribe(_ => {
      // this setTimout is necessary because chrome cancels the mouse-event associated
      // with window focus if navigator.clipboard.read() is called synchronously with the event
      window.setTimeout(() => {
        this.update()
      }, 250) // 250ms is arbitrary
    }))
    
  }

  public onDestroy(): void {
    this._subscriptions.forEach(s => s.unsubscribe())
  }

  public get accessGranted() { return this.state.value === 'granted' || this.state.value === 'grantedWithContent' }
  public get accessPending() { return this.state.value === 'prompt' }
  public get accessDenied () { return this.state.value === 'denied' }
  
  public get hasClipboardContents() { return typeof this.clipboardContents !== 'undefined' }
  
  public async update(forceCheck = false) {
    if (this.accessGranted || forceCheck) {
      try {
        const res = await navigator.clipboard.read()
        this.clipboardContents = res[0]
      } catch(e) {
        this.clipboardContents = undefined
      }
    }
    const state = (await navigator.permissions.query({name: 'clipboard-read' as PermissionName})).state
    this.state.next(this.hasClipboardContents ? 'grantedWithContent' : state)
  }

  public async getStringContent() {

    const clipboardContents = this.clipboardContents
    if (!clipboardContents) return

    let htmlString: string | undefined = undefined
    let plainString: string | undefined = undefined

    try {
      const htmlBlob  = await this.clipboardContents!.getType('text/html')
      htmlString  = htmlBlob  ? await htmlBlob .text() : undefined
    } catch(e) {}

    try {
      const plainBlob = await clipboardContents.getType('text/plain')
      plainString = plainBlob ? await plainBlob.text() : undefined
    } catch(e) {}

    return {
      html     : htmlString,
      plainText: plainString
    }

  }

  public openDeniedDialog(): void {
    this.dialog.open(PasteDeniedDialogComponent)
  }

}
