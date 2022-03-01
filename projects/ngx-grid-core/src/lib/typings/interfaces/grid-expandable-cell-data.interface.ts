import { Subject } from 'rxjs'


export interface IGridExpandableCellData {
  backgroundColor?: string
  expandTrigger   : Subject<void>
}
