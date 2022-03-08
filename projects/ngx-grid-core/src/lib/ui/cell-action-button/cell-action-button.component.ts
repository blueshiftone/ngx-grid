import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { DomSanitizer, SafeHtml } from '@angular/platform-browser'

@Component({
  selector: 'data-grid-cell-action-button',
  templateUrl: './cell-action-button.component.html',
  styleUrls: ['./cell-action-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CellActionButtonComponent implements OnInit {

  @Input() public icon?: string
  @Input() public actionType?: string

  @Output() public action = new EventEmitter<void>()

  private readonly _iconMap = new Map<string, string>([
    [`close`, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"> <path d="M0 0h24v24H0V0z" fill="none" /> <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" /></svg>`],
    [`add`  , `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"> <rect width="24" height="24" style="fill:none" /> <path d="M23,13.6h-9.5V23h-3.2v-9.5H1v-3.2h9.5V1h3.2v9.5H23V13.6z" /> </svg>`],
    [`more` , `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"> <rect width="24" height="24" style="fill:none" /> <path d="M20.82,14.94A2.94,2.94,0,1,1,23.77,12,2.94,2.94,0,0,1,20.82,14.94Zm-8.82,0A2.94,2.94,0,1,1,14.94,12,2.94,2.94,0,0,1,12,14.94Zm-8.82,0A2.94,2.94,0,1,1,6.12,12,2.95,2.95,0,0,1,3.18,14.94Z" style="fill-rule:evenodd" /></svg>`]
  ])

  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
  }

  public get svgIcon(): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(this._iconMap.get(this.icon ?? this.actionType ?? '') ?? '')
  }

}
