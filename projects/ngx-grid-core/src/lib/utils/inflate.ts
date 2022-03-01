import { IDeflatedJSON } from './deflate'

export function Inflate<T>(data: IDeflatedJSON): T[] {
  const output: T[] = []
  data.rows.forEach(row => {
    const obj: any = {}
    row.forEach((v, i) => obj[data.columns[i]] = v)
    output.push(obj)
  })
  return output
}