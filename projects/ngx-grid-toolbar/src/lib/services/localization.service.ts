import { Injectable } from '@angular/core'
import { Subject } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class LocalizationService {

  public static readonly defaultCulture     = navigator.language
  public static readonly cultureSettingsKey = 'LocaleCulture'

  public changes = new Subject<void>()

  public culture : string = LocalizationService.defaultCulture

  private _locMap: Map<string, string> = new Map()

  constructor() {}

  public getLocalizedString(str: string): string {
    return this._locMap.get(str) ?? str
  }

  public setCulture(culture: string): void {
    this.culture = culture
  }

  public setLocalizations(localizations: ILocalization[]) {
    this._locMap.clear()
    localizations.forEach(l => this._locMap.set(l.key, l.value)) 
  }
}

export interface ILocalization {
  key: string;
  value: string;
}
