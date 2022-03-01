import { Observable, OperatorFunction, pipe, UnaryFunction } from 'rxjs'
import { filter } from 'rxjs/operators'

export function removeNullish<T>(): UnaryFunction<Observable<T | null | undefined>, Observable<T>> {
  return pipe(
    filter(x => x != null) as OperatorFunction<T | null |  undefined, T>
  );
}
