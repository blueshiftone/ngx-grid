import { ChangeDetectionStrategy, Component, Input } from '@angular/core'

@Component({
  selector: 'lib-loading-dots',
  templateUrl: './loading-dots.component.html',
  styleUrls: ['./loading-dots.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoadingDotsComponent {

  @Input()
  public showText = false

  @Input()
  public text = 'Loading...'

}
