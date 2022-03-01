import { animate, query, stagger, style, transition, trigger } from '@angular/animations'

export const LIST_ANIMATION = trigger('listAnimation', [
  transition('* <=> *', [
    query(':enter',
      [style({ opacity: 0, transform: 'translateX(-50px)' }), stagger('40ms', animate('200ms ease-out', style({ opacity: 1, transform: 'translateX(0px)' })))],
      { optional: true }
    ),
    query(':leave',
      animate('100ms', style({ opacity: 0, transform: 'translateX(-50px)' })),
      { optional: true}
    )
  ])
]);
