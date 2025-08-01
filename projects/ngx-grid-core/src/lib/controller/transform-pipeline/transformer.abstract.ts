import { Subject } from 'rxjs'
import { GridControllerService } from '../grid-controller.service'

export abstract class Transformer<T> {

  public abstract name: string

  private _next?: Transformer<T>
  private _prev?: Transformer<T>

  private _value?: T[]

  public get value(): T[] {
    let v = this._value
    let prev = this.prev()
    while (v === undefined && prev !== undefined) {
      v = prev?.value
      prev = prev.prev()
    }
    return v ?? []
  }

  public set value(v: T[] | undefined) {
    this._value = v
  }

  public get hasOwnValue(): boolean { return this._value !== undefined }

  public touched = new Subject<void>();
  public destroyed = new Subject<void>();

  constructor() { }

  public touch() {
    this.touched.next()
  }

  public prev(): Transformer<T> | undefined {
    return this._prev
  }

  public next(): Transformer<T> | undefined {
    return this._next
  }

  public setNext(transformation?: Transformer<T>) {
    this._next = transformation
  }

  public setPrev(transformation?: Transformer<T>) {
    this._prev = transformation
  }

  public abstract run(): Promise<T[] | undefined>

  public abstract clone(gridController: GridControllerService): Transformer<T>
}
