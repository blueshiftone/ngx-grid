import { DetectDelimiter } from './detect-csv-delimiter'
import { GetCsvScore } from './get-csv-score'

export function LooksLikeCSV(data: string, delimiter = DetectDelimiter(data)): boolean {

  return GetCsvScore(data, delimiter) > 20

}
