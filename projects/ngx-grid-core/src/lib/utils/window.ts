import { InjectionToken } from '@angular/core'

export const WINDOW = new InjectionToken<Window>(
  'An abstraction over global window object',
  {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    factory: () => {
      // const { defaultView } = inject(DOCUMENT)

      // if (!defaultView) {
      //   throw new Error('Window is not available')
      // }

      // return defaultView

      return window;
    },
  },
)
