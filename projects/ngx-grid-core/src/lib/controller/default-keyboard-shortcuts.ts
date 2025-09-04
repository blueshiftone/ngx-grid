import { IKeyboardShortcut } from "../typings/interfaces/keyboard-shortcut.interface";

export const DefaultKeyboardShortcuts: IKeyboardShortcut[] = [
    // Insert a record:
    {
        key: [ { combination: 'Ctrl+N', swallowEvents: true }, { combination: 'F6', swallowEvents:true } ],
        action: controller => controller.row.InsertRowAtTop.run()
    },
    // Delete a row:
    {
        key: { combination: 'Ctrl+Minus', swallowEvents: true },
        action: controller => (controller.selection.latestSelection()?.rowKeys ?? []).forEach(rowKey => controller.row.DeleteRow.buffer(rowKey))
    },
    // Delete values from selected cells:
    {
        key: [ { combination: 'Delete', swallowEvents: true }, { combination: 'Backspace', swallowEvents:true } ],
        action: controller => {
            for (const coordinates of controller.selection.latestSelection()?.allCellCoordinates() ?? []) {
                if (controller.cell.GetCellIsEditable.run(coordinates)) {
                  controller.cell.CellComponents.findWithCoords(coordinates)?.setValue(null)
                  controller.cell.SetCellDraftValue.buffer(coordinates)
                  controller.cell.SetCellValue.run(coordinates, null)
                }
              }
        }
    },
    // Duplicate a row:
    {
        key: [ { combination: 'Ctrl+D', swallowEvents: true }, { combination: 'F7', swallowEvents: true } ],
        action: controller => controller.row.DuplicateRow.buffer()
    },
    // Revert records to saved version:
    {
        key: { combination: 'Ctrl+Z' },
        action: controller => controller.gridEvents.RevertSelectedEvent.emit()
    },
    // Commit changes to database:
    {
        key: { combination: 'Ctrl+S', swallowEvents: true },
        action: controller => controller.gridEvents.SaveGridEvent.emit()
    },
    // Refresh data (unedited rows only):
    //   See: grid.component.ts
    // Refresh data and revert records to saved version:
    //   See: grid.component.ts
    // Start / stop editing a cell:
    {
        key: { combination: 'F2' },
        action: controller => {
            const focusedComponent = controller.cell.GetFocusedCell.run()
            if (!focusedComponent || !focusedComponent.element.classList.contains('is-editable')) return
            if (controller.gridEvents.EditingCellChangedEvent.state?.coordinates.compositeKey === focusedComponent.coordinates.compositeKey) {
                // Close editing
                focusedComponent.typeComponent?.close()
                controller.gridEvents.EditingCellChangedEvent.emit(null)
            } else {
                // Open editing
                focusedComponent.typeComponent?.open();
                controller.gridEvents.EditingCellChangedEvent.emit(focusedComponent)
            }
        }
    },
    // Copy all columns in selected rows with headers:
    {
        key: { combination: 'Ctrl+Alt+Shift+C' },
        action: controller => controller.selection.CopySelection.run({ allColumns: true, withHeaders: true })
    },
    // Copy selected cells with headers:
    {
        key: { combination: 'Ctrl+Shift+C', swallowEvents: true },
        action: controller => controller.selection.CopySelection.run({ withHeaders: true })
    },
    // Copy all columns in selected rows:
    {
        key: { combination: 'Ctrl+Alt+C' },
        action: controller => controller.selection.CopySelection.run({ allColumns: true })
    },
    // Copy selected cells:
    {
        key: { combination: 'Ctrl+C' },
        action: controller => controller.selection.CopySelection.run()
    },
    // Focus the selected cell for editing (or toggle checkbox value):
    {
        key: [ { combination: 'Enter', swallowEvents: true }, { combination: 'Space' } ],
        action: controller => {
            const cell = controller.cell.GetFocusedCell.run()
            if (cell?.type.name === 'Boolean') cell.typeComponent?.setValue(!cell.typeComponent.value)
        }
    },
]