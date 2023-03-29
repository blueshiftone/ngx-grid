import { Injectable } from '@angular/core'
import { Subject } from 'rxjs'

import { LocalPreferencesService } from './local-preferences.service'
import { GRID_LOCALIZATION_DEFAULTS } from './localization.defaults'

@Injectable()
export class LocalizationService {

  public static readonly defaultCulture     = navigator.language
  public static readonly cultureSettingsKey = 'LocaleCulture'

  public changes = new Subject<void>()

  public culture : string   = this.prefs.get<string>(LocalizationService.cultureSettingsKey, LocalizationService.defaultCulture)

  private _locMap: Map<string, string> = new Map()
  private _defaultLocMap: Map<string, string> = new Map()

  constructor(
    private readonly prefs : LocalPreferencesService,
  ) {
    for (const [key, val] of GRID_LOCALIZATION_DEFAULTS.entries()) {
      this._defaultLocMap.set(key, val)
    }
  }

  public getLocalizedString(str: string): string {
    if (str.includes('$')) {
      const [matched, ...captureGroups] = str.match(/\$\{([^\}\\]|\\.)(.+)\}/) ?? [] as string[]
      const replacement = this._locMap.get(str.replace(matched, '')) ?? this._defaultLocMap.get(str.replace(matched, '')) ?? str
      return str.replace(str.replace(matched, ''), replacement).replace(matched, captureGroups.join(''))
    } else {
      return this._locMap.get(str) ?? this._defaultLocMap.get(str) ?? str
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
    const entries = [...this._locMap.entries()]
    for (const entry of this._defaultLocMap.entries()) {
      if (!this._locMap.has(entry[0])) {
        entries.push(entry)
      }
    }
    return entries.map(e => ({ key: e[0], value: e[1] }))
  }
}

export interface ILocalization {
  key: string;
  value: string;
}
