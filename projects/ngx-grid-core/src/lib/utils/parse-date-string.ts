export function ParseDate(dateStr: string) {
  /*
    Assumptions:
    Year is always four-digit yyyy and first or last in the date sequence
    If no separator character is supplied, format is assumed: yyyymmdd
  */

  if (typeof dateStr === 'undefined' || dateStr === null) return undefined

  let date: Date | undefined = undefined
  
  const toDate = (parts: IDateParts) => new Date(`${parts.year}-${parts.month.toString().padStart(2, '0')}-${parts.day.toString().padStart(2, '0')}`)
  
  let matchResult = dateStr.match(/(\d{1,4})[^\d]{1}(\d{1,2})[^\d]{1}(\d{1,4})/)
  if (matchResult) {
    const [match, datePart1, month, datePart3] = matchResult.map(v => parseInt(v))
    const year  = Math.max(datePart1, datePart3)
    const day   = Math.min(datePart1, datePart3)
    date = toDate({year, month, day})
  } else {
    matchResult = dateStr.match(/(\d{4})(\d{2})(\d{2})/)
    if (matchResult) {
      const [match, year, month, day] = matchResult.map(v => parseInt(v))
      date = toDate({year, month, day})
    }
  }
  return date && !isNaN(date.getTime()) ? date : undefined
}

interface IDateParts {
  year : number,
  month: number,
  day  : number
}
