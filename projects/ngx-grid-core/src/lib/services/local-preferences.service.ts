import { Inject, Injectable } from '@angular/core'

import { LOCALSTORAGE } from '../utils/local-storage'

@Injectable({
  providedIn: 'root'
})
export class LocalPreferencesService {

  constructor(
    @Inject(LOCALSTORAGE) private readonly localStorage: Storage,
  ) { }

  public get<T>(key: string, fallback: T) {
    try {
      const val = this.localStorage.getItem(key)
      const parsed = val && JSON.parse(val)
      return val && parsed !== undefined ? parsed as T : fallback
    } catch (e) {
      console.error(e)
    }
    return fallback
  }

  public set(key: string, val: any) {
    this.localStorage.setItem(key, JSON.stringify(val))
  }

  public remove(key: string) {
    this.localStorage.removeItem(key)
  }

}
