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
import { EGridOverlayType, GRID_OVERLAYS } from './typings/enums/grid-overlay-type.enum'
import { BodyComponent } from './ui/body/body.component'
import { CellActionButtonComponent } from './ui/cell-action-button/cell-action-button.component'
import { CellComponent } from './ui/cell/cell.component'
import { ChipComponent } from './ui/chip/chip.component'
import { ContextMenuComponent } from './ui/context-menu/context-menu.component'
import { ContextMenuDirective } from './ui/context-menu/context-menu.directive'
import { DataGridComponent } from './ui/data-grid/data-grid.component'
import { ErrorDialogComponent } from './ui/dialogs/error-dialog/error-dialog.component'
import { BottomPlusScrollbarDirective } from './ui/directives/absolute-position-minus-scrollbars.directive'
import { KeepVisibleDirective } from './ui/directives/keep-visible.directive'
import { ResponsiveBackgroundColorDirective } from './ui/directives/responsive-background-color.directive'
import { CellValidationMessageComponent } from './ui/grid-overlays/cell-validation-message/cell-validation-message.component'
import { ContextMenuOverlayComponent } from './ui/grid-overlays/context-menu-overlay/context-menu-overlay.component'
import { DateEditorOverlayComponent } from './ui/grid-overlays/date-editor-overlay/date-editor-overlay.component'
import { ExpandablePreviewPopupComponent } from './ui/grid-overlays/expandable-preview-popup/expandable-preview-popup.component'
import { FileGridCellPreviewOverlayComponent } from './ui/grid-overlays/file-grid-cell-preview-overlay/file-grid-cell-preview-overlay.component'
import { FileGridCellSelectedListComponent } from './ui/grid-overlays/file-grid-cell-selected-list/file-grid-cell-selected-list.component'
import { MarkdownEditorComponent } from './ui/grid-overlays/markdown-editor-overlay/markdown-editor-overlay.component'
import { MultiCellEditInputComponent } from './ui/grid-overlays/multi-cell-edit-input/multi-cell-edit-input.component'
import { MultiCellEditOverlayComponent } from './ui/grid-overlays/multi-cell-edit-overlay/multi-cell-edit-overlay.component'
import {
  MultiSelectForeignKeyDropdownOverlayComponent,
} from './ui/grid-overlays/multi-select-foreign-key-dropdown-overlay/multi-select-foreign-key-dropdown-overlay.component'
import { MultiSelectGridCellPreviewComponent } from './ui/grid-overlays/multi-select-grid-cell-preview/multi-select-grid-cell-preview.component'
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
import { LoadingDotsComponent } from './ui/loading-dots/loading-dots.component'
import { LocalizedTextComponent } from './ui/localized-text/localized-text.component'
import { RecordSelectorCellComponent, RecordSelectorComponent, RecordSelectorRowComponent } from './ui/record-selector'
import { RowIconComponent } from './ui/row/row-icon/row-icon.component'
import { RowComponent } from './ui/row/row.component'
import { SeparatorComponent } from './ui/separator/separator.component';
import { RowFloatingTitleComponent } from './ui/row/row-floating-title/row-floating-title.component'

GRID_OVERLAYS.set(EGridOverlayType.MarkdownEditor, MarkdownEditorComponent)
GRID_OVERLAYS.set(EGridOverlayType.DateEditorOverlay, DateEditorOverlayComponent)
GRID_OVERLAYS.set(EGridOverlayType.SingleSelectGridDropdownOverlay, SingleSelectGridDropdownOverlayComponent)
GRID_OVERLAYS.set(EGridOverlayType.StaticDropdownOverlay, StaticDropdownOverlayComponent)
GRID_OVERLAYS.set(EGridOverlayType.MultiSelectForeignKeyDropdownOverlay, MultiSelectForeignKeyDropdownOverlayComponent)
GRID_OVERLAYS.set(EGridOverlayType.MultiSelectGridCellPreview, MultiSelectGridCellPreviewComponent)
GRID_OVERLAYS.set(EGridOverlayType.RichTextCellPreview, RichTextCellPreviewComponent)
GRID_OVERLAYS.set(EGridOverlayType.MultiSelectGridSelectedList, MultiSelectGridSelectedListComponent)
GRID_OVERLAYS.set(EGridOverlayType.MultiSelectStaticCellPreview, MultiSelectStaticCellPreviewComponent)
GRID_OVERLAYS.set(EGridOverlayType.MultiSelectStaticListOverlay, MultiSelectStaticListOverlayComponent)
GRID_OVERLAYS.set(EGridOverlayType.SingleSelectSimpleForeignKeyDropdownOverlay, SingleSelectSimpleForeignKeyDropdownOverlayComponent)
GRID_OVERLAYS.set(EGridOverlayType.ContextMenuOverlay, ContextMenuOverlayComponent)
GRID_OVERLAYS.set(EGridOverlayType.MultiCellEditOverlay, MultiCellEditOverlayComponent)
GRID_OVERLAYS.set(EGridOverlayType.MultiCellEditInput, MultiCellEditInputComponent)
GRID_OVERLAYS.set(EGridOverlayType.CellValidationMessage, CellValidationMessageComponent)
GRID_OVERLAYS.set(EGridOverlayType.FileGridCellPreviewOverlay, FileGridCellPreviewOverlayComponent)
GRID_OVERLAYS.set(EGridOverlayType.FileGridCellSelectedList, FileGridCellSelectedListComponent)

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
    SeparatorComponent,
    SingleSelectGridDropdownOverlayComponent,
    StaticDropdownOverlayComponent,
    MultiSelectForeignKeyDropdownOverlayComponent,
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
    LocalizedTextComponent,
    FileGridCellPreviewOverlayComponent,
    ChipComponent,
    CellActionButtonComponent,
    FileGridCellSelectedListComponent,
    LoadingDotsComponent,
    BottomPlusScrollbarDirective,
    RowFloatingTitleComponent,
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
