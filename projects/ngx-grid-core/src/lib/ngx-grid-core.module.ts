import { OverlayModule } from '@angular/cdk/overlay'
import { ScrollingModule } from '@angular/cdk/scrolling'
import { CommonModule, DatePipe } from '@angular/common'
import { HttpClientModule } from '@angular/common/http'
import { NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatNativeDateModule } from '@angular/material/core'
import { MatDatepickerModule } from '@angular/material/datepicker'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

import { ComponentLibraryModule } from './modules/component-lib/component-library.module'
import { MarkdownEditorModule } from './modules/markdown-editor/markdown-editor.module'
import { BodyComponent } from './ui/body/body.component'
import { CellComponent } from './ui/cell/cell.component'
import { ContextMenuComponent } from './ui/context-menu/context-menu.component'
import { ContextMenuDirective } from './ui/context-menu/context-menu.directive'
import { DataGridComponent } from './ui/data-grid/data-grid.component'
import { ErrorDialogComponent } from './ui/dialogs/error-dialog/error-dialog.component'
import { KeepVisibleDirective } from './ui/directives/keep-visible.directive'
import { ResponsiveBackgroundColorDirective } from './ui/directives/responsive-background-color.directive'
import { CellValidationMessageComponent } from './ui/grid-overlays/cell-validation-message/cell-validation-message.component'
import { ContextMenuOverlayComponent } from './ui/grid-overlays/context-menu-overlay/context-menu-overlay.component'
import { DateEditorOverlayComponent } from './ui/grid-overlays/date-editor-overlay/date-editor-overlay.component'
import { ExpandablePreviewPopupComponent } from './ui/grid-overlays/expandable-preview-popup/expandable-preview-popup.component'
import GRID_OVERLAYS, { EGridOverlayTypes } from './ui/grid-overlays/grid-overlay-types'
import { MarkdownEditorComponent } from './ui/grid-overlays/markdown-editor-overlay/markdown-editor-overlay.component'
import { MultiCellEditInputComponent } from './ui/grid-overlays/multi-cell-edit-input/multi-cell-edit-input.component'
import { MultiCellEditOverlayComponent } from './ui/grid-overlays/multi-cell-edit-overlay/multi-cell-edit-overlay.component'
import { MultiSelectGridCellPreviewComponent } from './ui/grid-overlays/multi-select-grid-cell-preview/multi-select-grid-cell-preview.component'
import {
  MultiSelectGridDropdownOverlayComponent,
} from './ui/grid-overlays/multi-select-grid-dropdown-overlay/multi-select-grid-dropdown-overlay.component'
import { MultiSelectGridSelectedListComponent } from './ui/grid-overlays/multi-select-grid-selected-list/multi-select-grid-selected-list.component'
import { MultiSelectStaticCellPreviewComponent } from './ui/grid-overlays/multi-select-static-cell-preview/multi-select-static-cell-preview.component'
import { MultiSelectStaticListOverlayComponent } from './ui/grid-overlays/multi-select-static-list-overlay/multi-select-static-list-overlay.component'
import { RichTextCellPreviewComponent } from './ui/grid-overlays/rich-text-cell-preview/rich-text-cell-preview.component'
import {
  SingleSelectGridDropdownOverlayComponent,
} from './ui/grid-overlays/single-select-grid-dropdown-overlay/single-select-grid-dropdown-overlay.component'
import {
  SingleSelectSimpleForeignKeyDropdownOverlayComponent,
} from './ui/grid-overlays/single-select-simple-foreign-key-dropdown-overlay/single-select-simple-foreign-key-dropdown-overlay.component'
import { StaticDropdownOverlayComponent } from './ui/grid-overlays/static-dropdown-overlay/static-dropdown-overlay.component'
import { HeaderComponent } from './ui/header/header.component'
import { RecordSelectorCellComponent, RecordSelectorComponent, RecordSelectorRowComponent } from './ui/record-selector'
import { RowIconComponent } from './ui/row/row-icon/row-icon.component'
import { RowComponent } from './ui/row/row.component'
import { SeperatorComponent } from './ui/seperator/seperator.component'

GRID_OVERLAYS.set(EGridOverlayTypes.MarkdownEditor, MarkdownEditorComponent)
GRID_OVERLAYS.set(EGridOverlayTypes.DateEditorOverlay, DateEditorOverlayComponent)
GRID_OVERLAYS.set(EGridOverlayTypes.SingleSelectGridDropdownOverlay, SingleSelectGridDropdownOverlayComponent)
GRID_OVERLAYS.set(EGridOverlayTypes.StaticDropdownOverlay, StaticDropdownOverlayComponent)
GRID_OVERLAYS.set(EGridOverlayTypes.MultiSelectGridDropdownOverlay, MultiSelectGridDropdownOverlayComponent)
GRID_OVERLAYS.set(EGridOverlayTypes.MultiSelectGridCellPreview, MultiSelectGridCellPreviewComponent)
GRID_OVERLAYS.set(EGridOverlayTypes.RichTextCellPreview, RichTextCellPreviewComponent)
GRID_OVERLAYS.set(EGridOverlayTypes.MultiSelectGridSelectedList, MultiSelectGridSelectedListComponent)
GRID_OVERLAYS.set(EGridOverlayTypes.MultiSelectStaticCellPreview, MultiSelectStaticCellPreviewComponent)
GRID_OVERLAYS.set(EGridOverlayTypes.MultiSelectStaticListOverlay, MultiSelectStaticListOverlayComponent)
GRID_OVERLAYS.set(EGridOverlayTypes.SingleSelectSimpleForeignKeyDropdownOverlay, SingleSelectSimpleForeignKeyDropdownOverlayComponent)
GRID_OVERLAYS.set(EGridOverlayTypes.ContextMenuOverlay, ContextMenuOverlayComponent)
GRID_OVERLAYS.set(EGridOverlayTypes.MultiCellEditOverlay, MultiCellEditOverlayComponent)
GRID_OVERLAYS.set(EGridOverlayTypes.MultiCellEditInput, MultiCellEditInputComponent)
GRID_OVERLAYS.set(EGridOverlayTypes.CellValidationMessage, CellValidationMessageComponent)

@NgModule({
  declarations: [
    DataGridComponent,
    HeaderComponent,
    BodyComponent,
    CellComponent,
    RowComponent,
    RowIconComponent,
    MarkdownEditorComponent,
    DateEditorOverlayComponent,
    SeperatorComponent,
    SingleSelectGridDropdownOverlayComponent,
    StaticDropdownOverlayComponent,
    MultiSelectGridDropdownOverlayComponent,
    MultiSelectGridCellPreviewComponent,
    ExpandablePreviewPopupComponent,
    RichTextCellPreviewComponent,
    MultiSelectGridSelectedListComponent,
    MultiSelectStaticCellPreviewComponent,
    ResponsiveBackgroundColorDirective,
    MultiSelectStaticListOverlayComponent,
    RecordSelectorComponent,
    RecordSelectorRowComponent,
    RecordSelectorCellComponent,
    SingleSelectSimpleForeignKeyDropdownOverlayComponent,
    KeepVisibleDirective,
    ContextMenuDirective,
    ContextMenuComponent,
    ContextMenuOverlayComponent,
    MultiCellEditOverlayComponent,
    MultiCellEditInputComponent,
    CellValidationMessageComponent,
    ErrorDialogComponent,
  ],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    ScrollingModule,
    ComponentLibraryModule,
    FormsModule,
    ReactiveFormsModule,
    OverlayModule,
    MarkdownEditorModule,
    MatDatepickerModule,
    MatNativeDateModule,
    HttpClientModule,
  ],
  providers: [
    DatePipe
  ],
  exports: [
    DataGridComponent,
    RecordSelectorComponent
  ]
})
export class NgxGridCoreModule { }
