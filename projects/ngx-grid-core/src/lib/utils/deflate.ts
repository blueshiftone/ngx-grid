export function Deflate(d: any): IDeflatedJSON {
  if (typeof d === 'object' && !Array.isArray(d)) d = [d]
  if (typeof d[0] === 'object' && !Array.isArray(d[0])) {
    const cols = new Set<string>()
    const rows: any[] = []
    d.forEach((r: any) => {
      const values: any[] = []
      Object.keys(r).forEach(k => {
        values.push(r[k])
        cols.add(k)
      })
      rows.push(values)
    })
    return {
      columns: Array.from(cols),
      rows: rows
    }
  }
  return { columns: [], rows: [] }
}

export interface IDeflatedJSON {
  columns: string[],
  rows: any[][]
}
