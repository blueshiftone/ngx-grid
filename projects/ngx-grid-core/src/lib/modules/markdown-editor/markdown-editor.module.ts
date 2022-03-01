import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'

import { ComponentLibraryModule } from '../component-lib/component-library.module'
import { HyperlinkPopupComponent } from './ui/hyperlink-popup/hyperlink-popup.component'
import { MarkdownEditorComponent } from './ui/markdown-editor/markdown-editor.component'
import { MarkdownToolbarComponent } from './ui/markdown-toolbar/markdown-toolbar.component'

@NgModule({
  declarations: [
    MarkdownEditorComponent,
    MarkdownToolbarComponent,
    HyperlinkPopupComponent
  ],
  imports: [
    CommonModule,
    ComponentLibraryModule,
  ],
  exports: [
    MarkdownEditorComponent
  ]
})
export class MarkdownEditorModule { }
