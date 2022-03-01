import { InjectionToken } from '@angular/core'

export const LOCALSTORAGE = new InjectionToken<Storage>(
  'An abstraction over global window object',
  {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    factory: () => {

      if (!localStorage) {
        throw new Error('localStorage is not available')
      }

      return localStorage
    },
  },
)
