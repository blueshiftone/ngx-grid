import { Observable } from 'rxjs'


export interface IGridViewportAutoScrollConfigs {
  triggerAreaSize: number
  scrollFactor: number
  scrollRampUp: Observable<number>
}
