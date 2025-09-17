import { ChangeDetectionStrategy, ChangeDetectorRef, Component, computed, ElementRef, Inject, OnInit, signal, ViewChild, WritableSignal } from '@angular/core'
import { FormControl } from '@angular/forms'
import { fromEvent } from 'rxjs'

import { GRID_OVERLAY_DATA } from '../../../services/grid-overlay-service.service'
import { IGridOverlayData } from '../../../typings/interfaces'
import { ParseDate } from '../../../utils/parse-date-string'
import { BaseOverlayComponent } from '../base-grid-overlay.component'

type DateToken = 'yyyy' | 'MM' | 'dd'

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
  public inputCtrl           = new FormControl<string>('', { nonNullable: true })
  public invalidDate         = false

  private _lastKeyDown    = ''
  private _internalUpdate = false
  private _cannonicalFormat = 'yyyyMMdd'
  private _formatStr: string
  private _dateTokens: WritableSignal<DateToken[]> = signal(['yyyy', 'MM', 'dd'])
  private readonly _editorJoiner = '   '

  placeholder = computed(() => this._dateTokens().map(t => ({yyyy: 'YYYY', MM: 'MM', dd: 'DD'}[t])).join(' / '))
  inputClass = computed(() => this._dateTokens().map(t => ({yyyy: 'y', MM: 'm', dd: 'd'}[t])).join('-'))

  constructor(
    @Inject(GRID_OVERLAY_DATA) public override data: IGridOverlayData,
    public override cd: ChangeDetectorRef,
  ) { super(data, cd)
    this._formatStr = this.gridController.getDateFormat()
    this._parseFormat(this._formatStr)
  }

  override ngOnInit(): void {
    super.ngOnInit()

    if (!this.cell) return

    this.addSubscription(this.cell.valueChanged.subscribe(_ => this._initCalendar()))
    this._initCalendar()

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
      if (cursorPos == null) return

      const { starts, seps } = this._segmentStarts()

      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault()

        // Determine active segment by cursor position
        const segIndex = this._segmentIndexForCursor(cursorPos, starts)
        if (segIndex === -1) return

        // Extract current segments from editor value
        const segments = this._readEditorSegments(input.value)

        // Convert segments into y/m/d
        const ymd = this._segmentsToYmd(segments)
        if (!ymd) return
        let { year, month, day } = ymd

        const increment = e.key === 'ArrowUp' ? 1 : -1
        const segToken = this._dateTokens()[segIndex]

        if (segToken === 'yyyy') {
          year += increment
        } else if (segToken === 'MM') {
          month += increment
          if (month < 1) month = 12
          if (month > 12) month = 1
          // clamp day to month
          day = Math.min(day, this._daysInMonth(year, month))
        } else { // 'dd'
          const dim = this._daysInMonth(year, month)
          day += increment
          if (day < 1) day = dim
          if (day > dim) day = 1
        }

        // Write back to editor/value
        this.date = new Date(year, month - 1, day)
        input.value = this._editorStringFromDate(this.date)
        this._conformDateInput(input.value)
        this._validateDateInput()

        // restore cursor
        window.requestAnimationFrame(_ => input.setSelectionRange(cursorPos, cursorPos))
      }
      else if (e.key === 'ArrowRight' && seps.includes(cursorPos)) {
        e.preventDefault()
        input.setSelectionRange(cursorPos + this._editorJoiner.length, cursorPos + this._editorJoiner.length)
      }
      else if (e.key === 'ArrowLeft') {
        // If at the start of any segment except the first, jump back over the separator
        const startsSet = new Set(starts.slice(1)) // all starts except 0
        if (startsSet.has(cursorPos)) {
          e.preventDefault()
          input.setSelectionRange(cursorPos - this._editorJoiner.length, cursorPos - this._editorJoiner.length)
        }
      }
    }))

    this.addSubscription(fromEvent<KeyboardEvent>(this.inputEl.nativeElement, 'input').subscribe(e => {
      this._conformDateInput((e.target as HTMLInputElement).value)
      this._validateDateInput()
    }))
  }

  private _initCalendar() {
    if (this._internalUpdate) return this._internalUpdate = false
    this.date = ParseDate(this.cell.value, this._formatStr) ?? this.date
    this.calendarInitialised = true
    this._setInput()
    this.cd.detectChanges()
    return
  }

  public calendarChanged(d: Date): void {
    this._internalUpdate = true
    this.date            = d
    this._conformDateInput()
    this.updateValue(this._toString(this._cannonicalFormat))
  }

  private _parseFormat(fmt: string): void {
    this._dateTokens.set(fmt.match(/(yyyy|MM|dd)/g) as DateToken[] ?? ['yyyy', 'MM', 'dd'])
  }

  private _daysInMonth(year: number, month: number): number {
    return new Date(year, month, 0).getDate()
  }

  private _editorStringFromDate(d?: Date): string {
    return d ? this._getDateSegments(d).join(this._editorJoiner) : ''
  }

  private _toString(format: string): string {
    return this.date ? this._getDateSegments(this.date, format).join('/') : ''
  }

  private _getDateSegments(d?: Date, format?: string): string[] {
    if (!d) return []
    format ??= this._formatStr
    const dateTokens = format.match(/(yyyy|MM|dd)/g) as DateToken[] ?? ['yyyy', 'MM', 'dd']
    return dateTokens.map(t => {
      if (t === 'yyyy') return d.getFullYear().toString().padStart(4, '0')
      if (t === 'MM')   return (d.getMonth() + 1).toString().padStart(2, '0')
      return d.getDate().toString().padStart(2, '0') // 'dd'
    })
  }

  private _pad = (n: number, len = 2) => n.toString().padStart(len, '0')

  private _setInput(): void {
    this._conformDateInput()
    window.requestAnimationFrame(_ => this.inputEl.nativeElement.focus())
  }

  private _conformDateInput(v = this._editorStringFromDate(this.date)): void {
    if (!v) return

    const segments = this._readEditorSegments(v)

    // Placeholders: if typing fills a segment, insert an empty next segment to keep the visual separator when appropriate
    const last = segments[segments.length - 1] ?? ''
    const lastLen = last.length
    const expectedLens = this._dateTokens().map(t => t.length)

    if (this._lastKeyDown !== 'Backspace' && segments.length < 3) {
      const need = expectedLens[segments.length - 1]
      if (lastLen === need) segments.push('') // show the next group placeholder
    }

    const newValue = segments.join(this._editorJoiner)
    if (newValue === this.inputCtrl.value) return

    this.inputCtrl.setValue(newValue)
  }

  private _validateDateInput(): void {
    this.invalidDate = false
    const raw = (this.inputCtrl.value ?? '').trim()
    const digits = raw.replace(/[^0-9]+/g, '')

    if (digits.length === 8) {
      // Split digits into segments according to token order
      const segs = this._sliceDigitsByTokens(digits)
      const ymd = this._segmentsToYmd(segs)
      if (!ymd) {
        this.invalidDate = true
        this.cd.detectChanges()
        return
      }

      const canonical = `${this._pad(ymd.year, 4)}${this._pad(ymd.month)}${this._pad(ymd.day)}`
      const date = ParseDate(canonical, this._cannonicalFormat)
      if (!date) this.invalidDate = true
      else {
        this.date = date
        this._internalUpdate = true
        this.updateValue(this._toString(this._cannonicalFormat))
        this.calendarInitialised = false
        window.requestAnimationFrame(_ => {
          this.calendarInitialised = true
          this.cd.detectChanges()
        })
      }
    } else if (digits === '') {
      this.date = undefined
      this.updateValue(null)
    }
    this.cd.detectChanges()
  }

  /** Returns the 0-based start indices of each token segment inside the editor string, plus the indices where separators begin */
  private _segmentStarts(): { starts: number[], seps: number[] } {
    const lens = this._dateTokens().map(t => t.length)
    const starts: number[] = []
    let pos = 0
    for (let i = 0; i < lens.length; i++) {
      starts.push(pos)
      pos += lens[i]
      if (i < lens.length - 1) pos += this._editorJoiner.length
    }
    const seps: number[] = []
    for (let i = 0; i < lens.length - 1; i++) {
      seps.push(starts[i] + lens[i]) // index of the first space of the separator
    }
    return { starts, seps }
  }

  private _segmentIndexForCursor(cursorPos: number, starts: number[]): number {
    const lens = this._dateTokens().map(t => t.length)
    for (let i = 0; i < starts.length; i++) {
      const segStart = starts[i]
      const segEnd = segStart + lens[i] // exclusive end of digits
      if (cursorPos <= segEnd) return i
    }
    return starts.length - 1
  }

  private _readEditorSegments(editorValue: string): string[] {
    // Extract only digits and split by expected lengths in the configured token order
    const digits = editorValue.replace(/[^0-9]+/g, '').substring(0, 8)
    return this._sliceDigitsByTokens(digits, true)
  }

  private _sliceDigitsByTokens(digits: string, allowPartial = false): string[] {
    const out: string[] = []
    let idx = 0
    for (const t of this._dateTokens()) {
      const len = t.length
      const next = digits.substring(idx, idx + len)
      if (!allowPartial && next.length < len) break
      if (next.length) out.push(next)
      idx += len
    }
    return out
  }

  private _segmentsToYmd(segments: string[]): { year: number, month: number, day: number } | null {
    if (!segments.length) return null
    // Map segments in the configured order to y/m/d
    let y = 0, m = 0, d = 0
    for (let i = 0; i < this._dateTokens().length && i < segments.length; i++) {
      const tok = this._dateTokens()[i]
      const n = parseInt(segments[i], 10)
      if (isNaN(n)) continue
      if (tok === 'yyyy') y = n
      else if (tok === 'MM') m = n
      else d = n
    }
    if (y && m && d) return { year: y, month: m, day: d }
    return null
  }
}
