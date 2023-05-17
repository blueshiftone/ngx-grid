export type TLocalizationKey = string | {
  key: string
  variables: TLocalizationVariables
}

export type TLocalizationVariables = { [variableName: string]: any }
