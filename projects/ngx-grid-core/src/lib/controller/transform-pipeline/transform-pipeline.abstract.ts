import { BehaviorSubject, buffer, debounceTime, filter, firstValueFrom, map, merge, Subject, takeUntil, timeout } from 'rxjs'

import { Transformer } from './transformer.abstract'

export enum ETransformPipelineState {
  Idle = 'Idle',
  Running = 'Running',
}

export abstract class TransformPipeline<T> {
  // This class manages transformations of rows in the grid
  // e.g. sorting, grouping, etc.

  private _reProcess = new Subject<Transformer<T>>()

  // head is the first transformation in the pipeline
  private _head?: Transformer<T>

  // tail is the last transformation in the pipeline
  private _tail?: Transformer<T>

  public output = new BehaviorSubject<T[]>([])

  public destroyed = new Subject<void>()

  public get latestValue(): T[] { return this.output.value }
  public get firstValue(): T[] { return this.head?.value ?? [] }

  public get head() { return this._head }
  public get tail() { return this._tail }

  private _rejectCurrentTransform?: (reason?: any) => void
  private _runningTransform: Transformer<T> | null = null

  private _newTransformers = new Set<Transformer<T>>()
  private _transformerAdded = new Subject<void>()

  private _transformNames = new Set<string>()

  public state = new BehaviorSubject<ETransformPipelineState>(ETransformPipelineState.Idle)

  constructor() {

    // subscribe to the reprocess subject and reprocess the pipeline from the transformation that was touched onwards
    // use a debounce to prevent multiple reprocesses from happening at the same time (e.g. when multiple transformers are touched at the same time)
    // use a buffer to collect all the transformers that were touched and reprocess starting from the one closest to the head
    this._reProcess
      .pipe(takeUntil(this.destroyed), buffer(this._reProcess.pipe(debounceTime(1))), map(e => new Set(e)))
      .subscribe(async transformations => {

        if (!transformations.size) return
        
        let earliestTransformer: Transformer<T> | undefined = undefined

        if (transformations.size > 1) {
          // find the transformer closest to the head
          let transformer = this._head
          while (transformer !== undefined) {
            if (transformations.has(transformer)) {
              earliestTransformer = transformer
              break
            }
            transformer = transformer.next()
          }
        } else {
          [earliestTransformer] = transformations
        }

        if (!earliestTransformer) {         
          throw new Error('Transformer not found')
        }

        // if there is a current transformation running, reject it
        if (this._rejectCurrentTransform) {
          this._rejectCurrentTransform('Superceded by new transformation')
          this._rejectCurrentTransform = undefined
          this._runningTransform = null
        }
        // run the pipeline from the touched transformation onwards
        try {
          const output = await this._runTransforms(earliestTransformer)
          this.output.next(output)
          this._rejectCurrentTransform = undefined
          this._runningTransform = null
          this.state.next(ETransformPipelineState.Idle)
        } catch (e: any) {
          if (e instanceof Error)  {
            console.warn(e.message)
          } else {         
            console.warn(e);
          }
        }
      })

    // subscribe to _transformerAdded and run the pipeline from the first new transformer
    this._transformerAdded
      .pipe(takeUntil(this.destroyed), debounceTime(0))
      .subscribe(() => {
        let transformer = this._head
        while (transformer !== undefined) {
          if (this._newTransformers.has(transformer)) {
            transformer.touch()
            this._newTransformers.clear()
            break
          }
          transformer = transformer.next()
        }
      })

  }

  public addTransformation(transformation: Transformer<T>, insertAfter = this._tail) {
    if (this._rejectCurrentTransform) {
      console.warn(`Transformation Pipeline: Adding '${transformation.name}' while '${this._runningTransform?.name}' is running`)
    }

    // insert the transformation into the pipeline
    const tempNext = insertAfter?.next()
    insertAfter?.setNext(transformation)
    transformation.setPrev(insertAfter)
    transformation.setNext(tempNext)

    if (!this._head) this._head = transformation
    if (!this._tail || !transformation.next()) this._tail = transformation

    // subscribe to the touched event of the transformation
    transformation.touched
      .pipe(takeUntil(merge(transformation.destroyed, this.destroyed)))
      .subscribe(() => this._triggerReProcess(transformation))

    this._transformNames.add(transformation.name)
    this._newTransformers.add(transformation)
    this._transformerAdded.next()
  }

  public removeTransformation(transformation: Transformer<T>) {
    const prev = transformation.prev()
    const next = transformation.next()
    prev?.setNext(next)
    next?.setPrev(prev)
    transformation.destroyed.next()
    if (this._head === transformation) {
      this._head = next
    }
    
    if (this._tail === transformation) {
      this._tail = prev
    }
    this._transformNames.delete(transformation.name)
    if (next) this._triggerReProcess(next)
  }

  public hasTransform(name: string) {
    return this._transformNames.has(name)
  }

  public reset (data: T[] = []) {
    let prev = this._head
    while (prev !== undefined) {
      prev.destroyed.next()
      prev = prev.prev()
    }
    this._head = undefined
    this.output.next(data)
  }

  public getEffectiveTail(): Transformer<T> | undefined {
    // The effective tail of the pipeline is the last transformer with a value
    // Some transformers may have an empty value, so we need to traverse back to find the first transformer with its own value

    let effectiveTail = this.tail
    while (effectiveTail !== undefined && !effectiveTail?.hasOwnValue) {
      effectiveTail = effectiveTail.prev()
    }

    return effectiveTail
  }

  public isRunning() {
    return this.state.value === ETransformPipelineState.Running
  }

  public isIdle() {
    return this.state.value === ETransformPipelineState.Idle
  }

  public async whenIdle(timeoutMs = 1000) {
    return this.isIdle() || firstValueFrom(this.state.pipe(filter(state => state === ETransformPipelineState.Idle), timeout(timeoutMs)))
  }

  private _runTransforms(transformation: Transformer<T>): Promise<T[]> {
    if (this._rejectCurrentTransform !== undefined) {
      return Promise.reject('Transform already running')
    }
    return new Promise<T[]>(async (resolve, reject) => {
      this._rejectCurrentTransform = reject
      this._runningTransform = transformation
      let next: Transformer<T> | undefined = transformation
      let output = this.output.value
      let seenTransforms = new Set<Transformer<T>>()
      while (next !== undefined) {
        if (seenTransforms.has(next)) {
          reject('Circular reference')
          break
        }
        const res = await next.run()
        next.value = res
        output = next.value
        seenTransforms.add(next)
        next = next.next()
      }
      resolve(output)
    })
  }

  private _triggerReProcess(t: Transformer<T>) {
    this._reProcess.next(t)
    if (this.state.value === ETransformPipelineState.Idle) {
      this.state.next(ETransformPipelineState.Running)
    }
  }

}
