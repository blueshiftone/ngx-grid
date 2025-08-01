import { GridControllerService } from '../grid-controller.service'
import { Transformer } from './transformer.abstract'

export class GenericTransformer<T> extends Transformer<T> {

  constructor(
    public name: string,
    public run: () => Promise<T[] | undefined>
  ) {
    super()
  }

  public clone(_: GridControllerService): Transformer<T>
  {
    return new GenericTransformer<T>(this.name, this.run)
  }
}
