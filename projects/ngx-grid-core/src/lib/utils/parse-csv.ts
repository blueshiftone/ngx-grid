import { DetectDelimiter } from './detect-csv-delimiter'

export function ParseCSV(data: string) {
  return csvToArray(data, DetectDelimiter(data))
}

const csvToArray = (text: string, delimiter = ',') => {
  let previousChar = '',
      row          = [''],
      ret          = [row],
      i = 0,
      r = 0,
      s = !0,
      char;

  for (char of text) {
      if ('"' === char) {
          if (s && char === previousChar) row[i] += char;
          s = !s;
      } else if (delimiter === char && s) char = row[++i] = '';
      else if ('\n' === char && s) {
          if ('\r' === previousChar) row[i] = row[i].slice(0, -1);
          row = ret[++r] = [char = '']; i = 0;
      } else row[i] += char;
      previousChar = char;
  }
  return ret;
}

