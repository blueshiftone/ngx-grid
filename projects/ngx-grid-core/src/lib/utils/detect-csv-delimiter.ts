import { GetCsvScore } from './get-csv-score'

export function DetectDelimiter(input: string): string {
  const delimiters = [',', ';', '|', '\t']
  return delimiters
    .map<IDelimiterScore>(delimiter => ({delimiter: delimiter, score: GetCsvScore(input, delimiter)}))
    .reduce<IDelimiterScore>((prev, next) => next.score >= prev.score ? next : prev, { score: 0, delimiter: ',' })
    .delimiter
}

interface IDelimiterScore {
  delimiter: string
  score: number
}
