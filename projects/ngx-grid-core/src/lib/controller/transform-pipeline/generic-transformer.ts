import { Transformer } from './transformer.abstract'

export class GenericTransformer<T> extends Transformer<T> {

  constructor(
    public name: string,
    public run: () => Promise<T[] | undefined>
  ) {
    super()
  }

}
