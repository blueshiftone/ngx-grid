import { Injectable } from '@angular/core'
import { Subject } from 'rxjs'

import { LocalPreferencesService } from './local-preferences.service'

@Injectable({
  providedIn: 'root'
})
export class LocalizationService {

  public static readonly defaultCulture     = navigator.language
  public static readonly cultureSettingsKey = 'LocaleCulture'

  public changes = new Subject()

  public cultures: string[] = []
  public culture : string   = this.prefs.get<string>(LocalizationService.cultureSettingsKey, LocalizationService.defaultCulture)

  private _locMap         : Map<string, string>  = new Map()

  constructor(
    private readonly prefs : LocalPreferencesService,
  ) {}

  public getLocalizedString(str: string): string {
    return this._locMap.get(str) ?? str
  }

  public setCulture(culture: string): void {
    this.culture = culture
    this.prefs.set(LocalizationService.cultureSettingsKey, culture)
  }
}

export interface ILocalization {
  key: string;
  value: string;
}

