/* eslint-disable @typescript-eslint/naming-convention */
import { MultiRowSelectionStrategy as MultiRow } from './multi-row.selection-strategy'
import { SingleRowSelectionStrategy as SingleRow } from './single-row.selection-strategy'
import { StandardSelectionStrategy as Standard } from './standard.selection-strategy'

const SELECTION_STRATEGIES = {
  Standard,
  SingleRow,
  MultiRow
}

type T = typeof SELECTION_STRATEGIES
export type TSelectionStrategies = T[keyof T]
export type TSelectionStrategyName = keyof typeof SELECTION_STRATEGIES

export default SELECTION_STRATEGIES
