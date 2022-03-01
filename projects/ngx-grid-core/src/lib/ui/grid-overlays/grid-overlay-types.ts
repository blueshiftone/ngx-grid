import { ComponentType } from "@angular/cdk/portal"

export enum EGridOverlayTypes {
  MarkdownEditor,
  DateEditorOverlay,
  SingleSelectGridDropdownOverlay,
  StaticDropdownOverlay,
  MultiSelectGridDropdownOverlay,
  MultiSelectGridCellPreview,
  RichTextCellPreview,
  MultiSelectGridSelectedList,
  MultiSelectStaticCellPreview,
  MultiSelectStaticListOverlay,
  SingleSelectSimpleForeignKeyDropdownOverlay,
  ContextMenuOverlay,
  MultiCellEditOverlay,
  MultiCellEditInput,
  CellValidationMessage
}

let GRID_OVERLAYS = new Map<EGridOverlayTypes, ComponentType<any>>()

export default GRID_OVERLAYS
