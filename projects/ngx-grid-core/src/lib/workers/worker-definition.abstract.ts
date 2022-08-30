import { nanoid } from 'nanoid'
import { filter, firstValueFrom, Subject } from 'rxjs'

export abstract class WorkerDefinition<TInput, TOutput> {

  protected abstract getWorker(): Worker

  private worker?: Worker

  private outputStream = new Subject<{ id: string, output: TOutput }>()

  public run(input: TInput): Promise<TOutput> {

    let runId = nanoid()

    return new Promise<TOutput>(resolve => {
      if (!this.worker) {
        this.worker = this.getWorker()
        this.worker.onmessage = ({ data }) => this.outputStream.next(data)
      }
      firstValueFrom(this.outputStream.pipe(filter(data => data.id === runId))).then(data => resolve(data.output));
      this.worker.postMessage({ input, id: runId })
    })
  }
}
