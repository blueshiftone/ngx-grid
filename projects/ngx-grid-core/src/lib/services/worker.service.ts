import { Injectable } from '@angular/core'

import { SortRecords } from '../workers'

@Injectable({
  providedIn: 'root'
})
export class WorkerService {

  constructor() { }

  public sortRecords = new SortRecords()

}
