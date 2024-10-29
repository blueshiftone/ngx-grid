import { INgxGridTheme } from "./ngx-grid-theme.interface"

export const DefaultTheme: INgxGridTheme = {
    appBackground: 'var(--app-bg)',
    textColor: 'var(--text-color)',
    fontSize: '13px',
    borderColor: 'var(--divider-color)',
    gridFocusedShadow: '0.25px 0.25px 2px 1px var(--primary-color-50)',
    gridBorderTopWidth: '1px',
    gridBorderRightWidth: '1px',
    gridBorderBottomWidth: '1px',
    gridBorderLeftWidth: '1px',
    
    rowHeight: '25px',
    rowBackgroundColorFocused: 'var(--highlight-color-10)',
    rowBackgroundColorSelected: 'var(--highlight-color)',
    rowBackgroundColorPreSelected: 'var(--light-dull-highlight)',
    rowBackgroundColorHover: 'var(--highlight-color-10)',

    floatingTitleBackgroundColorHover: 'var(--primary-color-10)',
    
    rowThumbWidth: '22px',
    rowThumbBaseBackgroundColor: 'var(--app-bg)',
    rowThumbBackgroundColor: 'var(--app-bg-contrasted)',
    rowThumbBackgroundColorHover: 'var(--highlight-color)',
    rowThumbBackgroundColorSelected: 'var(--highlight-color-10)',
    rowThumbBorderColorSelected: 'var(--primary-color-vivid)',
    rowThumbBorderSelectedWidth: '2px',
    rowThumbActionTextColor: 'var(--divider-color)',
    rowThumbActionTextColorHover: 'var(--text-color)',
    rowThumbBorderRightWidth: '1px',
    rowThumbBorderBottomWidth: '1px',

    columnBackgroundColorSelected: 'var(--highlight-color-10)',
    columnBorderColorSelected: 'var(--primary-color-vivid)',
    columnBorderSelectedWidth: '2px',
    
    cellCursor: 'cell',
    cellBackgroundColor: 'var(--heavy-dull-highlight)',
    cellOutlineColorSelectedHover: 'var(--primary-color-40)',
    cellOutlineWidth: '1px',
    cellBorderHorizontalWidth: '1px',
    cellBorderVerticalWidth: '1px',
    cellBorderColor: 'var(--divider-color-solid)',
    cellBackgroundColorEditable: 'var(--primary-color-10)',
    cellButtonBackgroundColor: 'var(--primary-color-themed)',
    cellButtonBackgroundColorHover: 'var(--primary-color-contrast)',
    
    chipInputBackdropColor: 'var(--primary-color-40)',

    fileDropzoneBackdropColor: 'var(--highlight-color)',
    fileDropzoneBackgroundColor: 'var(--app-bg-contrasted)',
    fileDropzoneTextColor: 'var(--primary-color-themed)',
    
    selectionInset: '-0.5px',
    selectionOverlappingBorderColor: 'var(--primary-color-vivid)',
    selectionOverlappingBackgroundColorSelected: 'var(--primary-color-contrast-30)',
    selectionOverlappingBackgroundColorFocusedSelected: 'transparent',
    selectionBorderWidth: '2px',
    selectionBorderTopStyle: 'solid',
    selectionBorderRightStyle: 'solid',
    selectionBorderLeftStyle: 'solid',
    selectionBorderBottomStyle: 'solid',
    selectionMultiselectBorderColor: 'var(--heavy-dull-highlight)',
    selectionMultiselectBorderColorFocused: 'var(--primary-color)',
    selectionMultiselectBorderWidth: '1px',
    
    cellActionButtonBackground: 'var(--light-contrasting-15)',
    cellActionButtonBackgroundHover: 'var(--light-contrasting-25)',
    
    contextMenuItemBackgroundColor: 'var(--highlight-color)',

    headerColumnFontSize: '13px',
    headerColumnFontWeight: 'normal',
}
