import { Subject } from 'rxjs'
import { bufferTime, switchMap, take } from 'rxjs/operators'

export class BufferOperation {

  private _promise?: Promise<any>
  private _stream  : Subject<any> = new Subject()

  constructor (
    private readonly runFn: (...args: any) => Promise<any>
  ) {}

  public next(args?: any[]) {
    if (!this._promise) {
      this._promise = new Promise<void>(resolve => {
        this._stream
          .pipe(bufferTime(0), take(1), switchMap(args => this.runFn(args)))
          .subscribe()
          .add(() => {
            this._promise = undefined
            resolve()
          })
      })
    }

    this._stream.next(args)

    return this._promise
  }
  
}
