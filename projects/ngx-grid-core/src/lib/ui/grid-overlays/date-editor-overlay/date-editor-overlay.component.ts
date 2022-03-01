import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core'
import { FormControl } from '@angular/forms'
import { fromEvent } from 'rxjs'

import { GRID_OVERLAY_DATA } from '../../../services/grid-overlay-service.service'
import { IGridOverlayData } from '../../../typings/interfaces'
import { ParseDate } from '../../../utils/parse-date-string'
import { BaseOverlayComponent } from '../base-grid-overlay.component'

@Component({
  selector: 'app-date-editor-overlay',
  templateUrl: './date-editor-overlay.component.html',
  styleUrls: ['./date-editor-overlay.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DateEditorOverlayComponent extends BaseOverlayComponent implements OnInit {

  @ViewChild('input', { read: ElementRef, static: true }) public inputEl!: ElementRef<HTMLInputElement>

  public date?: Date
  public calendarInitialised = false
  public inputCtrl           = new FormControl()
  public invalidDate         = false

  private _lastKeyDown    = ''
  private _internalUpdate = false

  constructor(
    @Inject(GRID_OVERLAY_DATA) public override data: IGridOverlayData,
    public override cd: ChangeDetectorRef,
  ) { super(data, cd) }

  override ngOnInit(): void {
    super.ngOnInit()

    if (!this.cell) return

    this.addSubscription(this.cell.valueChanged.subscribe(_ => {
      if (this._internalUpdate) return this._internalUpdate = false
      this.date = ParseDate(this.cell.value) ?? this.date
      this.calendarInitialised = true
      this._setInput()
      this.cd.detectChanges()
      return true
    }))

    // Arrow key bindings to increment/decrement values
    this.addSubscription(fromEvent<KeyboardEvent>(this.inputEl.nativeElement, 'keydown').subscribe(e => {
      this._lastKeyDown = e.key

      if (e.key === 'Enter') {
        e.stopImmediatePropagation()
        e.preventDefault()
        this.close()
        return
      }

      /* Override default cursor behaviour for arrow keys  */
      const input     = e.target as HTMLInputElement
      const cursorPos = input.selectionStart
      if (!cursorPos) return
      if (['ArrowDown', 'ArrowUp'].includes(e.key)) {
        e.preventDefault()
        
        const matches = input.value.replace(/[^0-9]+/g, '').padEnd(8, ' ').substring(0, 8).match(/(.{4})(.{2})(.{2})/)!
        let [match, year, month, day] = matches.map(m => parseInt(m))
        const increment = e.key === 'ArrowUp' ? 1 : -1
        
        if      (cursorPos < 5  && !isNaN(year))  year  += increment
        else if (cursorPos < 10 && !isNaN(month)) month += increment
        else if (!isNaN(day))                     day   += increment

        input.value = `${year}${this._pad(month)}${this._pad(day)}`

        this._conformDateInput((e.target as HTMLInputElement).value)
        this._validateDateInput()

        window.requestAnimationFrame(_ => input.setSelectionRange(cursorPos, cursorPos))
      }
      else if (e.key === 'ArrowRight' && (cursorPos === 4 || cursorPos === 9)) {
        e.preventDefault()
        input.setSelectionRange(cursorPos + 3, cursorPos + 3)
      }
      else if (e.key == 'ArrowLeft' && (cursorPos === 7 || cursorPos === 12)) {
        e.preventDefault()
        input.setSelectionRange(cursorPos - 3, cursorPos - 3)
      }
    }))

    this.addSubscription(fromEvent<KeyboardEvent>(this.inputEl.nativeElement, 'input').subscribe(e => {
      this._conformDateInput((e.target as HTMLInputElement).value)
      this._validateDateInput()
    }))
  }

  public calendarChanged(d: Date): void {
    this._internalUpdate = true
    this.date            = d
    this._conformDateInput()
    this.updateValue(this._toString())
  }

  private _toString(): string {
    if (!this.date) return ''
    return `${this.date.getFullYear()}/${this._pad(this.date.getMonth() + 1)}/${this._pad(this.date.getDate())}`
  }

  private _pad = (n: number) => n.toString().padStart(2, '0')

  private _setInput(): void {
    this._conformDateInput()
    window.requestAnimationFrame(_ => this.inputEl.nativeElement.select())
  }

  private _conformDateInput(v = this._toString()): void {
    if (!v) return
    const matches = v.replace(/[^0-9]+/g, '').padEnd(8, ' ').substring(0, 8).match(/(.{4})(.{2})(.{2})/)
    if (!matches) return
    const [match, a, b, c] = matches
    const output = [a, b, c].map(s => s.trim()).filter(s => s)
    if (output.length) {
      const lastLen = output[output.length - 1].length
      if (
        this._lastKeyDown !== 'Backspace' &&
        output.length < 3 &&
        ((output.length === 1 && lastLen === 4) ||
          (output.length === 2 && lastLen == 2))
      ) output.push('')
    }
    this.inputCtrl.setValue(output.join('   '))
  }

  private _validateDateInput(): void {
    this.invalidDate = false
    const val = this.inputCtrl.value.trim().replace(/[^0-9]+/g, '')
    if (val.length === 8) {
      const date = ParseDate(val)
      if (!date) this.invalidDate = true
      else {
        this.date = date
        this._internalUpdate = true
        this.updateValue(this._toString())
        this.calendarInitialised = false
        window.requestAnimationFrame(_ => {
          this.calendarInitialised = true
          this.cd.detectChanges()
        })
      }
    } else if (val === '') {
      this.date = undefined
      this.updateValue('')
    }
    this.cd.detectChanges()
  }

}
