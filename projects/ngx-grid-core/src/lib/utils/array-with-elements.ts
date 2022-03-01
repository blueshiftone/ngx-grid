export class ArrayWith {
  private _length: number
  constructor(len: number) {
    this._length = len
  }
  public elements<T>(fn: () => T): Array<T> {
    return Array.from(Array(this._length).keys()).map(_ => fn())
  }
}