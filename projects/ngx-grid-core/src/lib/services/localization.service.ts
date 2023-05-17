import { Injectable } from '@angular/core'
import { map, Observable, startWith, Subject } from 'rxjs'

import { TLocalizationKey, TLocalizationVariables } from '../typings/types'
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

  public getLocalizedString(input: TLocalizationKey, variables?: TLocalizationVariables): string {
    if (typeof input === 'object') {
      variables = input.variables
      input = input.key
    }
    let str = this._locMap.get(input) ?? input
    
    if (variables) {
      for (const [key, value] of Object.entries(variables)) {
        str = str.replace(`{${key}}`, this.getLocalizedString(value))
      }
    }
    return str
  }

  public getLocalizationStringObservable(str: string): Observable<string> {
    return this.changes.pipe(map(() => this.getLocalizedString(str)), startWith(this.getLocalizedString(str)))
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
