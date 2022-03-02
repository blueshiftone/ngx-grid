import { Injectable } from '@angular/core'
import { MatIconRegistry } from '@angular/material/icon'
import { DomSanitizer } from '@angular/platform-browser'

export enum EGridIcon {
  CheckedBox,
  CheckBox,
  Check,
  Asterisk,
  Cross,
  Copy,
  Paste,
  Delete,
  EditPen,
  TriangleArrowRight,
  InsertAtTop,
  InsertAboveSelection,
  InsertAtBottom,
  InsertBelowSelection,
  MultiEdit,
  SimpleSelector,
  ExclamationMark,
  ClipboardCheckCross,
  Italic,
  Blockquote,
  Strike,
  Underline,
  Bold,
  BulletList,
  OrderedList,
  Code,
  Hyperlink,
  Paragraph,
  Heading1,
  Heading2,
  Link,
  Undo,
 }

@Injectable({
  providedIn: 'root'
})
export class IconsService {

  private _iconData = new Map<EGridIcon, string>([
    [ EGridIcon.CheckedBox, `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"> <path d="M23.1,44.2L10.8,31.9l-4.2,4.2l16.5,16.5l35.4-35.4L54.3,13L23.1,44.2z"/> <g> <polygon points="3.1,32.5 7.3,28.4 8.8,26.8 8.8,8.7 51.5,8.7 54.3,5.9 57.9,9.5 60.8,12.4 60.8,8.7 60.8,2.9 60.8,2.9 55,2.9  55,2.9 2.9,2.9 2.9,2.9 2.9,32.7 	"/> <polygon points="55,27.8 55,54.9 27.9,54.9 26.6,56.1 23.1,59.6 19.6,56.1 18.3,54.9 8.8,54.9 8.8,45.4 3.1,39.6 2.9,39.5  2.9,54.9 2.9,60.7 8.8,60.7 55,60.7 60.8,60.7 60.8,60.7 60.8,21.9 	"/> </g> </svg>`],
    [ EGridIcon.CheckBox, `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"> <path d="M55,2.9L55,2.9h-52l0,0h0v52v5.9h5.9H55h5.9h0v-52V2.9v0H55z M55,54.9H8.8V8.7H55V54.9z"/> </svg>`],
    [ EGridIcon.Check, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21 21"><polygon points="7.27 17.29 1.66 11.69 3.08 10.28 7.27 14.46 17.92 3.81 19.34 5.22 7.27 17.29"/></svg>`],
    [ EGridIcon.Asterisk, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><path d="M45,9.15a4.34,4.34,0,0,1,1.31,6.41L35.54,29.76v.29l17-2.26a4.35,4.35,0,0,1,4.88,3.74,5.44,5.44,0,0,1,0,.57v0a4.34,4.34,0,0,1-4.32,4.36,4.58,4.58,0,0,1-.53,0L35.54,34.4v.3L46.31,48.16a4.33,4.33,0,0,1-.68,6.1,4.14,4.14,0,0,1-.55.38l-.52.29a4.34,4.34,0,0,1-5.93-1.61,3.13,3.13,0,0,1-.22-.45L31.64,37h-.29L24,53a4.34,4.34,0,0,1-5.76,2.13Q18,55,17.7,54.85l0,0a4.35,4.35,0,0,1-1.32-6,3.62,3.62,0,0,1,.22-.32l10.85-14v-.29l-16.6,2.13A4.36,4.36,0,0,1,6,32.64a5.25,5.25,0,0,1,0-.56h0a4.34,4.34,0,0,1,4.34-4.34,3.52,3.52,0,0,1,.56,0L27.27,29.9v-.29L16.65,15.83a4.35,4.35,0,0,1,.79-6.09,3.74,3.74,0,0,1,.49-.32l.37-.22a4.35,4.35,0,0,1,5.93,1.62c.07.12.13.24.19.37L31.48,27h.29L38.7,11.09a4.35,4.35,0,0,1,5.72-2.25l.4.2Z"/></svg>`],
    [ EGridIcon.Cross, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><path d="M54,13.7,50.3,10a2.61,2.61,0,0,0-3.71,0L32,24.61,17.41,10a2.61,2.61,0,0,0-3.71,0L10,13.7a2.61,2.61,0,0,0,0,3.71L24.61,32,10,46.59a2.61,2.61,0,0,0,0,3.71L13.7,54a2.61,2.61,0,0,0,3.71,0L32,39.39,46.59,54a2.61,2.61,0,0,0,3.71,0L54,50.3a2.61,2.61,0,0,0,0-3.71L39.39,32,54,17.41A2.61,2.61,0,0,0,54,13.7Z"/></svg>`],
    [ EGridIcon.Copy, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21 21"><path d="M14.8,0H3.34A1.92,1.92,0,0,0,1.43,1.91V15.27H3.34V1.91H14.8Zm2.86,3.82H7.16A1.92,1.92,0,0,0,5.25,5.73V19.09A1.92,1.92,0,0,0,7.16,21h10.5a1.92,1.92,0,0,0,1.91-1.91V5.73A1.92,1.92,0,0,0,17.66,3.82Zm0,15.27H7.16V5.73h10.5Z"/></svg>`],
    [ EGridIcon.Paste, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21 21"><path d="M17.18,1.91h-4a2.85,2.85,0,0,0-5.38,0h-4A1.92,1.92,0,0,0,1.91,3.82V19.09A1.92,1.92,0,0,0,3.82,21H17.18a1.92,1.92,0,0,0,1.91-1.91V3.82A1.92,1.92,0,0,0,17.18,1.91Zm-6.68,0a1,1,0,1,1-.95,1A.95.95,0,0,1,10.5,1.91Zm6.68,17.18H3.82V3.82H5.73V6.68h9.54V3.82h1.91Z"/></svg>`],
    [ EGridIcon.Delete, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21 21"><path d="M4.12,18.83a2,2,0,0,0,2,2h9.49a2,2,0,0,0,2-2V4.93H4.12Zm2-11.9h9.43V18.79l-9.43,0Z"/><polygon points="15.01 1.55 13.67 0.26 7.93 0.26 6.79 1.41 6.68 1.55 2.77 1.55 2.77 3.55 18.84 3.55 18.84 1.55 15.01 1.55"/></svg>`],
    [ EGridIcon.EditPen, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><path d="M38.44,22.68l2.88,2.88L13,53.89H10.11V51L38.44,22.68M49.7,3.86a3.14,3.14,0,0,0-2.19.9l-5.72,5.72L53.51,22.21l5.73-5.72a3.11,3.11,0,0,0,0-4.41L51.92,4.76A3.1,3.1,0,0,0,49.7,3.86Zm-11.26,10L3.85,48.42V60.14H15.58L50.17,25.56Z"/></svg>`],
    [ EGridIcon.TriangleArrowRight, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><path d="M21.54,55.66,45.13,32.07,21.54,8.48Z"/></svg>`],
    [ EGridIcon.InsertAtTop, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21 21"><path d="M13.5,8a.5.5,0,0,0-.5.5V10H8V8.5a.5.5,0,0,0-1,0V10H2V8.5a.5.5,0,0,0-1,0v9.2A1.3,1.3,0,0,0,2.3,19H12.7A1.3,1.3,0,0,0,14,17.7V8.5A.5.5,0,0,0,13.5,8ZM8,11h5v3H8V11ZM7,11v3H2V11ZM2,17.7V15H7v3H2.3A.3.3,0,0,1,2,17.7Zm10.7.3H8V15h5v2.7A.29.29,0,0,1,12.7,18Z"/><path d="M19.5,1.8H7.5a.5.5,0,0,0-.5.5v4a.5.5,0,0,0,.5.5h12a.5.5,0,0,0,.5-.5v-4A.5.5,0,0,0,19.5,1.8Zm-.5,4H8v-3H19Z"/><path d="M1,4.5a.42.42,0,0,0,.11.16l2,2a.46.46,0,0,0,.35.14.46.46,0,0,0,.35-.14.5.5,0,0,0,0-.71L2.71,4.8H5.5A.5.5,0,0,0,6,4.3a.5.5,0,0,0-.5-.5H2.71L3.85,2.66a.5.5,0,0,0,0-.71.5.5,0,0,0-.7,0l-2,2A.42.42,0,0,0,1,4.11.53.53,0,0,0,1,4.5Z"/></svg>`],
    [ EGridIcon.InsertAboveSelection, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21 21"><g style="opacity:0.5"><rect x="2" y="13.9" width="11" height="3.1" transform="translate(15 30.9) rotate(-180)"/></g><path d="M1.5,4.29a.5.5,0,0,0,.5-.5V2.59a.3.3,0,0,1,.3-.3H7v1.5a.5.5,0,0,0,1,0V2.29h4.7a.3.3,0,0,1,.3.3v1.2a.5.5,0,0,0,1,0V2.59a1.3,1.3,0,0,0-1.3-1.3H2.3A1.3,1.3,0,0,0,1,2.59v1.2A.5.5,0,0,0,1.5,4.29Z"/><path d="M13.5,10.77a.5.5,0,0,0-.5.5V12.9H8V11.27a.5.5,0,0,0-1,0V12.9H2V11.27a.5.5,0,0,0-1,0V19.5a.5.5,0,0,0,1,0V18H7v1.5a.5.5,0,0,0,1,0V18h5v1.5a.5.5,0,0,0,1,0V11.27A.5.5,0,0,0,13.5,10.77ZM7,17H2V13.9H7Zm6,0H8V13.9h5Z"/><path d="M19.5,5.1H7.5a.5.5,0,0,0-.5.5v4a.5.5,0,0,0,.5.5h12a.5.5,0,0,0,.5-.5v-4A.5.5,0,0,0,19.5,5.1Zm-.5,4H8v-3H19Z"/><path d="M1.15,8l2,2a.48.48,0,0,0,.7,0,.5.5,0,0,0,0-.71L2.71,8.1H5.5A.5.5,0,0,0,6,7.6a.5.5,0,0,0-.5-.5H2.71L3.85,6a.5.5,0,0,0,0-.71.5.5,0,0,0-.7,0l-2,2A.45.45,0,0,0,1,7.41a.5.5,0,0,0,0,.38A.36.36,0,0,0,1.15,8Z"/></svg>`],
    [ EGridIcon.InsertAtBottom, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21 21"><path d="M1.5,12.8a.5.5,0,0,0,.5-.5V10.8H7v1.5a.5.5,0,0,0,1,0V10.8h5v1.5a.5.5,0,0,0,1,0V3.1a1.3,1.3,0,0,0-1.3-1.3H2.3A1.3,1.3,0,0,0,1,3.1v9.2A.5.5,0,0,0,1.5,12.8ZM7,9.8H2v-3H7v3Zm1,0v-3h5v3Zm5-6.7V5.8H8v-3h4.7A.3.3,0,0,1,13,3.1ZM2.3,2.8H7v3H2V3.1A.3.3,0,0,1,2.3,2.8Z"/><path d="M19.5,14H7.5a.5.5,0,0,0-.5.5v4a.5.5,0,0,0,.5.5h12a.5.5,0,0,0,.5-.5v-4A.5.5,0,0,0,19.5,14ZM19,18H8V15H19Z"/><path d="M5.5,16H2.71l1.14-1.15a.49.49,0,1,0-.7-.7l-2,2a.36.36,0,0,0-.11.16.5.5,0,0,0,0,.38.36.36,0,0,0,.11.16l2,2a.48.48,0,0,0,.7,0,.48.48,0,0,0,0-.7L2.71,17H5.5a.5.5,0,0,0,0-1Z"/></svg>`],
    [ EGridIcon.InsertBelowSelection, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21 21"><g style="opacity:0.5"><rect x="2" y="4.29" width="11" height="3.1" transform="translate(15 11.69) rotate(180)"/></g><path d="M13.5,17a.5.5,0,0,0-.5.5v1.2a.29.29,0,0,1-.3.3H8V17.5a.5.5,0,0,0-1,0V19H2.3a.29.29,0,0,1-.3-.3V17.5a.5.5,0,0,0-1,0v1.2A1.3,1.3,0,0,0,2.3,20H12.7A1.3,1.3,0,0,0,14,18.7V17.5A.5.5,0,0,0,13.5,17Z"/><path d="M1.5,10.52A.5.5,0,0,0,2,10V8.39H7V10a.5.5,0,0,0,1,0V8.39h5V10a.5.5,0,0,0,1,0V1.79a.5.5,0,1,0-1,0v1.5H8V1.79a.5.5,0,1,0-1,0v1.5H2V1.79a.5.5,0,0,0-1,0V10A.5.5,0,0,0,1.5,10.52ZM8,4.29h5v3.1H8Zm-6,0H7v3.1H2Z"/><path d="M19.5,11.2H7.5a.5.5,0,0,0-.5.5v4a.5.5,0,0,0,.5.5h12a.5.5,0,0,0,.5-.5v-4A.5.5,0,0,0,19.5,11.2Zm-.5,4H8v-3H19Z"/><path d="M1.15,14.05l2,2a.48.48,0,0,0,.7,0,.5.5,0,0,0,0-.71L2.71,14.2H5.5a.5.5,0,0,0,.5-.5.5.5,0,0,0-.5-.5H2.71l1.14-1.15a.5.5,0,0,0,0-.71.5.5,0,0,0-.7,0l-2,2A.42.42,0,0,0,1,13.5a.53.53,0,0,0,0,.39A.42.42,0,0,0,1.15,14.05Z"/></svg>`],
    [ EGridIcon.MultiEdit, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21 21"><path d="M9.72-5.55h24v24h-24Z" style="fill:none"/><path d="M17.48.82a.89.89,0,0,0-.62.26L15.23,2.7,18.57,6l1.62-1.63a.88.88,0,0,0,0-1.25L18.11,1.08A.87.87,0,0,0,17.48.82Z"/><path d="M14.28,3.65,4.45,13.48v3.34H7.78L17.61,7ZM7.05,15H6.23v-.82l8-8L15.1,7Z"/><path d="M12.22,14.15v1.67H10.55l-1,1h2.67v2.7a.3.3,0,0,1-.3.3H7.22V18.33h0v-.25h-1v1.75H1.52a.29.29,0,0,1-.3-.3V18.33h0v-1.5h2v-1h-2v-3H3.35l1-1H1.22V9.12a.3.3,0,0,1,.3-.3h4.7V10l1-1V8.82h.13l1-1H1.52a1.3,1.3,0,0,0-1.3,1.3v1.19h0v9.2a1.3,1.3,0,0,0,1.3,1.3h10.4a1.3,1.3,0,0,0,1.3-1.3V18.33h0V13.15Z"/></svg>`],
    [ EGridIcon.SimpleSelector, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21 21"><path d="M6.87,4.78h0c-.05.21-.11.43-.18.64l-.34,1H7.4l-.34-1C7,5.2,6.93,5,6.87,4.78Z"/><path d="M9.16,7.2a.41.41,0,0,0,.44.44.62.62,0,0,0,.61-.43.4.4,0,0,0,0-.15V6.62C9.73,6.61,9.16,6.7,9.16,7.2Z"/><path d="M16.24,3.2H4.76a3,3,0,0,0,0,6H16.24a3,3,0,0,0,0-6ZM7.88,7.92,7.5,6.81H6.24L5.87,7.92H5.4L6.6,4.38h.56L8.37,7.92Zm2.43,0,0-.32h0A.94.94,0,0,1,9.47,8a.72.72,0,0,1-.77-.73c0-.62.54-1,1.53-1v0a.53.53,0,0,0-.58-.59A1.19,1.19,0,0,0,9,5.85l-.11-.31a1.66,1.66,0,0,1,.84-.22c.78,0,1,.53,1,1v.95a3.74,3.74,0,0,0,0,.61Z"/><path d="M9.16,15.81a.41.41,0,0,0,.44.44.62.62,0,0,0,.61-.43.35.35,0,0,0,0-.14v-.45C9.73,15.22,9.16,15.31,9.16,15.81Z"/><path d="M6.87,13.39h0c-.05.21-.11.43-.18.64l-.34,1H7.4l-.34-1C7,13.81,6.93,13.6,6.87,13.39Z"/><path d="M16.24,11.84H4.76a3,3,0,0,0,0,6H16.24a3,3,0,0,0,0-6ZM7.88,16.53,7.5,15.42H6.24l-.37,1.11H5.4L6.6,13h.56l1.21,3.54Zm2.43,0,0-.32h0a.94.94,0,0,1-.78.38.72.72,0,0,1-.77-.73c0-.61.54-.95,1.53-.95v-.05a.53.53,0,0,0-.58-.59,1.28,1.28,0,0,0-.66.19l-.11-.3a1.57,1.57,0,0,1,.84-.23c.78,0,1,.53,1,1v.95a3.67,3.67,0,0,0,0,.61Z"/></svg>`],
    [ EGridIcon.ExclamationMark, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21 21"><path d="M9,16.42a1.33,1.33,0,0,1,.4-1A1.53,1.53,0,0,1,10.48,15a1.58,1.58,0,0,1,1.09.37,1.33,1.33,0,0,1,.4,1,1.35,1.35,0,0,1-.4,1,1.54,1.54,0,0,1-1.09.38,1.49,1.49,0,0,1-1.05-.38A1.35,1.35,0,0,1,9,16.42ZM9.29,6.11h2.42v6L11.24,14H9.76l-.47-1.95Z"/><path d="M18.39,21H2.54A2.55,2.55,0,0,1,.26,17.28L8.18,1.43a2.56,2.56,0,0,1,4.57,0l7.92,15.85A2.55,2.55,0,0,1,18.39,21ZM10.46,2a.54.54,0,0,0-.49.31L2.05,18.18a.54.54,0,0,0,.49.79H18.39a.54.54,0,0,0,.47-.26.52.52,0,0,0,0-.53L11,2.33A.54.54,0,0,0,10.46,2Z"/></svg>`],
    [ EGridIcon.ClipboardCheckCross, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><path id="eb7f5d16-6ff5-46a3-91f8-2c5a7018e649" data-name="curve1" d="M24.74,41.4l2.1-2.1a1.32,1.32,0,0,1,1.87,0l4.36,4.36,4.36-4.36a1.32,1.32,0,0,1,1.87,0l2.1,2.1a1.33,1.33,0,0,1,0,1.87L37,47.63,41.4,52a1.33,1.33,0,0,1,0,1.87L39.3,56a1.33,1.33,0,0,1-1.87,0L33.07,51.6,28.71,56a1.33,1.33,0,0,1-1.87,0l-2.1-2.1a1.32,1.32,0,0,1,0-1.87l4.36-4.36-4.36-4.36A1.32,1.32,0,0,1,24.74,41.4Z" style="fill:#e68396"/><path id="a6e397dd-f70d-43ad-a47a-3cfa5d6a97f9" data-name="curve3" d="M14.9,11.69v47H49.1v-47A4.28,4.28,0,0,1,53.38,16V58.72A4.28,4.28,0,0,1,49.1,63H14.9a4.28,4.28,0,0,1-4.28-4.28V16A4.28,4.28,0,0,1,14.9,11.69Zm8.55,0h17.1v2.14H23.45Z"/><path id="b084915d-f3b0-44ca-a3ff-bca1705f1002" data-name="curve2" d="M23.45,9.55a2.16,2.16,0,0,0-2.14,2.14v2.14A2.16,2.16,0,0,0,23.45,16h17.1a2.16,2.16,0,0,0,2.14-2.14V11.69a2.15,2.15,0,0,0-2.14-2.14Zm17.1-4.27A6.43,6.43,0,0,1,47,11.69v2.14c0,3.53-2.88,4.27-6.42,4.27H23.45c-3.54,0-6.42-.74-6.42-4.27V11.69a6.43,6.43,0,0,1,6.42-6.41C23.45,4.09,27.28,1,32,1S40.55,4.09,40.55,5.28ZM32,3.14a2.14,2.14,0,1,0,2.14,2.14A2.14,2.14,0,0,0,32,3.14Z"/><path id="b74a0369-72c3-4035-bdd9-8ae06c340a41" data-name="curve0" d="M22.62,29.08l2.62-2.62a1,1,0,0,1,1.44,0L30,29.8l9.44-9.44a1,1,0,0,1,1.43,0L43.52,23a1,1,0,0,1,0,1.44L30.74,37.21a1,1,0,0,1-1.43,0l-6.69-6.69A1,1,0,0,1,22.62,29.08Z" style="fill:#76a797"/></svg>`],
    [ EGridIcon.Italic, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M15,2V4h4.3L10.6,28H6v2H17V28H12.7L21.4,4H26V2Z"/></svg>`],
    [ EGridIcon.Blockquote, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M13.8,3.87A12.08,12.08,0,0,0,1.7,16v12.1H15V14.77H4.1A9.76,9.76,0,0,1,13.8,6Zm15.5,0A12.08,12.08,0,0,0,17.2,16v12.1H30.5V14.77h-11A9.76,9.76,0,0,1,29.2,6V3.87ZM3.9,17.07h8.8v8.8H3.9Zm15.4,0h8.8v8.8H19.3Z"/></svg>`],
    [ EGridIcon.Strike, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M12.5,2A7.55,7.55,0,0,0,5,9.47,7.4,7.4,0,0,0,7.4,15H2v2H30V15H12.5A5.42,5.42,0,0,1,7,9.47,5.42,5.42,0,0,1,12.5,4H26V2ZM23.8,19a5.31,5.31,0,0,1,1.2,3.5A5.42,5.42,0,0,1,19.5,28H6v2H19.5a7.55,7.55,0,0,0,7.5-7.5,6.76,6.76,0,0,0-.9-3.5Z"/></svg>`],
    [ EGridIcon.Underline, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M5,2V14a11,11,0,0,0,22,0V2H25V14A9,9,0,0,1,7,14V2ZM5,28v2H27V28Z"/></svg>`],
    [ EGridIcon.Bold, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M5,2V30H19.5a7.55,7.55,0,0,0,7.5-7.5,7.38,7.38,0,0,0-6.7-7.3A7.58,7.58,0,0,0,23,9.47,7.55,7.55,0,0,0,15.5,2Zm2.7,2.6h7.6a4.84,4.84,0,0,1,4.9,4.9,4.91,4.91,0,0,1-4.9,4.9H7.7Zm.2,13H19.1a4.9,4.9,0,1,1,0,9.8H7.9Z"/></svg>`],
    [ EGridIcon.BulletList, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M5,3A3.08,3.08,0,0,0,2,6,3.08,3.08,0,0,0,5,9,3.08,3.08,0,0,0,8,6,3.08,3.08,0,0,0,5,3ZM5,5A.94.94,0,0,1,6,6,.94.94,0,0,1,5,7,.94.94,0,0,1,4,6,.94.94,0,0,1,5,5Zm5,0V7H30V5ZM5,13a3,3,0,0,0,0,6,3,3,0,1,0,0-6Zm0,2a1,1,0,1,1,0,2,.94.94,0,0,1-1-1A1,1,0,0,1,5,15Zm5,0v2H30V15ZM5,23a3,3,0,0,0,0,6,3,3,0,0,0,0-6Zm0,2a1,1,0,0,1,0,2,.94.94,0,0,1-1-1A1,1,0,0,1,5,25Zm5,0v2H30V25Z"/></svg>`],
    [ EGridIcon.OrderedList, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M10,5V7H30V5Zm0,10v2H30V15Zm0,10v2H30V25Z"/><path d="M4.4,5.7h0l-1.7.9L2.3,5.2,4.6,4H6.1v9.6H4.4Z"/><path d="M1,28V26.9l1.1-1.1c2.3-2.1,3.3-3.2,3.3-4.5a1.5,1.5,0,0,0-1.7-1.6,3.06,3.06,0,0,0-2,.8l-.5-1.3a5,5,0,0,1,2.9-1,2.87,2.87,0,0,1,3.2,2.9c0,1.7-1.2,3-2.9,4.6l-.8.7H7.5V28Z"/></svg>`],
    [ EGridIcon.Code, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M17.8,4.17l-6.9,23,2.2.7,6.9-23ZM7.7,8.27,0,16l7.7,7.7,1.6-1.6L3.2,16l6.1-6.1Zm16.6,0-1.6,1.6L28.8,16l-6.1,6.1,1.6,1.6L32,16Z"/></svg>`],
    [ EGridIcon.Link, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M23.8,1.77a7,7,0,0,0-4.6,1.9l-6.1,6,1.5,1.5,6.1-6a4.12,4.12,0,0,1,6.1,0,4.12,4.12,0,0,1,0,6.1l-6.1,6,1.5,1.5,6.1-6a6.58,6.58,0,0,0,0-9.2A6.44,6.44,0,0,0,23.8,1.77Zm-2,6.9L8.7,21.77l1.5,1.5,13.1-13.1ZM9.8,13,3.7,19a6.58,6.58,0,0,0,0,9.2,6.58,6.58,0,0,0,9.2,0l6.1-6-1.5-1.5-6.1,6a4.12,4.12,0,0,1-6.1,0,4.2,4.2,0,0,1,0-6.1l6.1-6Z"/></svg>`],
    [ EGridIcon.Paragraph, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M13,2a8,8,0,0,0,0,16h5V30h2V4h2V30h2V4h3V2Zm0,2h5V16H13A6,6,0,0,1,13,4Z"/></svg>`],
    [ EGridIcon.Heading1, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M4.7,5.5v8.8H14.9V5.5h2.7v21H14.9V16.6H4.7v9.9H2V5.5Z"/><path d="M27.3,8.8h0l-3.6,1.9-.5-2.1,4.4-2.4h2.3V26.5H27.2V8.8Z"/></svg>`],
    [ EGridIcon.Heading2, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M20.5,26.5V25.3L22,23.8c3.6-3.4,5.2-5.3,5.3-7.4a2.56,2.56,0,0,0-2.8-2.8,5.16,5.16,0,0,0-3,1.2l-.6-1.3a6.44,6.44,0,0,1,4-1.4,4,4,0,0,1,4.3,4.1c0,2.6-1.9,4.7-4.9,7.6l-1.1,1h6.3v1.6h-9Z"/><path d="M4.7,5.5v8.8H14.9V5.5h2.7v21H14.9V16.6H4.7v9.9H2V5.5Z"/></svg>`],
    [ EGridIcon.Undo, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21 21"><path d="M10.73,7.44a9.2,9.2,0,0,0-6,2.27L1.55,6.57v7.86H9.42L6.26,11.27a7,7,0,0,1,11.11,3.16l2.08-.68A9.2,9.2,0,0,0,10.73,7.44Z"/></svg>`],
  ]);

  constructor(
    private readonly iconRegistry: MatIconRegistry,
    private readonly domSanitizer: DomSanitizer,
  ) { }

  public init(): void {
    for (const icon of this._iconData.entries()) {
      this.iconRegistry.addSvgIconLiteral(EGridIcon[icon[0]], this.domSanitizer.bypassSecurityTrustHtml(icon[1]))
    }
  }
}
