import { Injectable } from '@angular/core'
import { Subject } from 'rxjs'

import { LocalPreferencesService } from './local-preferences.service'
import { GRID_LOCALIZATION_DEFAULTS } from './localization.defaults'

@Injectable({
  providedIn: 'root'
})
export class LocalizationService {

  public static readonly defaultCulture     = navigator.language
  public static readonly cultureSettingsKey = 'LocaleCulture'

  public changes = new Subject<void>()

  public culture : string   = this.prefs.get<string>(LocalizationService.cultureSettingsKey, LocalizationService.defaultCulture)

  private _locMap: Map<string, string> = new Map()

  constructor(
    private readonly prefs : LocalPreferencesService,
  ) {
    for (const entry of GRID_LOCALIZATION_DEFAULTS.entries()) {
      this._locMap.set(entry[0], entry[1])
    }
  }

  public getLocalizedString(str: string): string {
    if (str.includes('$')) {
      const [matched, ...captureGroups] = str.match(/\$\{([^\}\\]|\\.)(.+)\}/) ?? []
      const replacement = this._locMap.get(str.replace(matched, '')) ?? str
      return str.replace(str.replace(matched, ''), replacement).replace(matched, captureGroups.join(''))
    } else {
      return this._locMap.get(str) ?? str
    }
  }

  public setCulture(culture: string): void {
    this.culture = culture
    this.prefs.set(LocalizationService.cultureSettingsKey, culture)
  }

  public setLocalizations(localizations: ILocalization[]) {
    this._locMap.clear()
    localizations.forEach(l => this._locMap.set(l.key, l.value))    
    this.changes.next()
  }

  public getLocalizations(): ILocalization[] {
    return [...this._locMap.entries()].map(e => ({ key: e[0], value: e[1] }))
  }
}

export interface ILocalization {
  key: string;
  value: string;
}
