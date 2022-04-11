import { ComponentType } from '@angular/cdk/portal'

export enum EGridOverlayType {
  MarkdownEditor,
  DateEditorOverlay,
  SingleSelectGridDropdownOverlay,
  StaticDropdownOverlay,
  MultiSelectForeignKeyDropdownOverlay,
  MultiSelectGridCellPreview,
  RichTextCellPreview,
  MultiSelectGridSelectedList,
  MultiSelectStaticCellPreview,
  MultiSelectStaticListOverlay,
  SingleSelectSimpleForeignKeyDropdownOverlay,
  ContextMenuOverlay,
  MultiCellEditOverlay,
  MultiCellEditInput,
  CellValidationMessage,
  FileGridCellPreviewOverlay,
  FileGridCellSelectedList,
}

export const GRID_OVERLAYS = new Map<EGridOverlayType, ComponentType<any>>()

