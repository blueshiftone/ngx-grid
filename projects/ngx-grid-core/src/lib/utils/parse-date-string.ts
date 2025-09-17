export function ParseDate(dateStr: string, format: string) {
  if (typeof dateStr === 'undefined' || dateStr === null) return undefined
  
  let date: Date | undefined = undefined
  
  const toDate = (parts: IDateParts) => new Date(`${parts.year}-${parts.month.toString().padStart(2, '0')}-${parts.day.toString().padStart(2, '0')}`)
  
  format = format.toLowerCase().replace(/[^ymd]/g, '')
  const expectedYearPosition: YearPosition = format.startsWith('y') ? 'start' : 'end'
  
  let matchResult = dateStr.match(/(\d{1,4})[^\d]{1}(\d{1,2})[^\d]{1}(\d{1,4})/)
  if (matchResult) {
    const [_, part1, part2, part3] = matchResult.map(v => parseInt(v))
    const actualYearPosition: YearPosition = part1 > 999 ? 'start' : 'end'
    const dateParts: IDateParts = {
      year: 0,
      month: 0,
      day: 0
    }
    if (expectedYearPosition !== actualYearPosition) {
      format = actualYearPosition === 'start' ? 'yyyyMMdd' : 'ddMMyyyy'
    }
    if (format.startsWith('y')) {
      dateParts.year = part1
      dateParts.month = part2
      dateParts.day = part3
    } else {
      dateParts.year = part3
      if (format.startsWith('m')) {
        dateParts.month = part1
        dateParts.day = part2
      } else {
        dateParts.day = part1
        dateParts.month = part2
      }
    }
    date = toDate(dateParts)
  } else {
    matchResult = dateStr.match(/(\d{4})(\d{2})(\d{2})/)
    if (matchResult) {
      const [_, year, month, day] = matchResult.map(v => parseInt(v))
      date = toDate({year, month, day})
    }
  }
  return date && !isNaN(date.getTime()) ? date : undefined
}

type YearPosition = 'start' | 'end'

interface IDateParts {
  year : number,
  month: number,
  day  : number
}
