export function GetCsvScore(data: string, delimiter: string): number {

  // return high score if delimiter is a tab character
  if (delimiter.match(/\t/)) return 100

  let score = 0

  let lines = data.split(/\r\n|\n|\r/)
  if (lines.length > 10) lines.length = 10
  lines = lines.filter(line => line !== '')

  const delimiterRegexp     = new RegExp(`\\${delimiter}`, 'g')
  const delimiterOccurances = lines.map(line => (line.match(delimiterRegexp) ?? []).length)
  const min                 = Math.min(...delimiterOccurances)
  const max                 = Math.max(...delimiterOccurances)
  if (!max) return 0
  
  // Weight the score according to min/max delimiter count
  const dif = max - min
  score += Math.exp(max + (!dif && lines.length > 1 ? lines.length : 0))
  score -= Math.exp(dif)

  if (data.length > 1000) data = data.substr(0, 1000)
  
  const balancePoint           = 2.5
  let   delimiterBalancedRatio = (((data.match(delimiterRegexp) ?? []).length / data.length) * 100) - balancePoint
  
  // Weight the score according to the ratio of delimiters
  if (delimiterBalancedRatio < 0) score -= Math.exp(Math.abs(delimiterBalancedRatio))
  else                            score += Math.exp(Math.abs(delimiterBalancedRatio))

  return score
}
