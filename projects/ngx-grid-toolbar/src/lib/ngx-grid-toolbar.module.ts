import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatRippleModule } from '@angular/material/core'
import { MatDialogModule } from '@angular/material/dialog'
import { MatIconModule } from '@angular/material/icon'
import { MatMenuModule } from '@angular/material/menu'
import { MatTooltipModule } from '@angular/material/tooltip'

import { FloatingToolbarComponent } from './ui/floating-toolbar/floating-toolbar.component'
import { PasteDeniedDialogComponent } from './ui/paste-denied-dialog/paste-denied-dialog.component'
import {
  CommitRecordsComponent,
  CopySelectionComponent,
  DeleteRecordsComponent,
  InsertRecordComponent,
  PasteComponent,
  RevertRecordsComponent,
} from './ui/static-toolbar/items'
import { ToolbarComponent } from './ui/static-toolbar/toolbar.component';
import { LocalizedTextComponent } from './ui/localized-text/localized-text.component'

const materialModules = [
  MatButtonModule,
  MatRippleModule,
  MatDialogModule,
  MatIconModule,
  MatMenuModule,
  MatTooltipModule
]

@NgModule({
  declarations: [
    ToolbarComponent,
    InsertRecordComponent,
    CopySelectionComponent,
    DeleteRecordsComponent,
    RevertRecordsComponent,
    CommitRecordsComponent,
    PasteDeniedDialogComponent,
    PasteComponent,
    FloatingToolbarComponent,
    LocalizedTextComponent,
  ],
  imports: [
    CommonModule,
    ...materialModules
  ],
  exports: [
    ToolbarComponent
  ]
})
export class NgxGridToolbarModule { }
