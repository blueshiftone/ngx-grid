import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core'
import { fromEvent } from 'rxjs'
import { distinctUntilChanged, filter, skip } from 'rxjs/operators'

import { AutoUnsubscribe } from '../../../../utils/auto-unsubscribe'
import { MarkdownService } from '../../markdown.service'

@Component({
  selector: 'markdown-editor',
  templateUrl: './markdown-editor.component.html',
  styleUrls: ['./markdown-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    MarkdownService
  ],
})
export class MarkdownEditorComponent extends AutoUnsubscribe implements OnInit, OnChanges {

  @Input() public value: string = ''
  @Input() public autoFocus = false
  @Output() public valueChanged = new EventEmitter<string>()

  public activeActions: Set<string> = new Set()
  public markdown = ''

  @ViewChild('editor', { static: true }) public editorNode!: ElementRef<HTMLElement>

  constructor(
    private readonly editor: MarkdownService,
  ) { super() }

  ngOnInit(): void {
    this.editor.value.next(this.value)
    this.editor.init(this.editorNode.nativeElement)
    this.editor.value.pipe(distinctUntilChanged(), skip(1)).subscribe(v => {
      this.valueChanged.emit(v)
    })
    this.addSubscription(fromEvent<MouseEvent>(this.editorNode.nativeElement, 'click')
      .pipe(filter(e => (e.target as HTMLElement).classList.contains('editor')))
      .subscribe(_ => this.editor.focus()))

    if (this.autoFocus) this.editor.focus()
  }

  ngOnChanges(): void {
    this.editor.updateValue(this.value)
    if (!this.editor.hasFocus) this.editor.focus()
  }

  public override appOnDestroy(): void {
    this.editor.onDestroy()
  }

}
