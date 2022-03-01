import { Directive, EventEmitter, OnInit, Output } from '@angular/core'

@Directive({
  selector: '[ngInit]'
})
export class NgInitDirective implements OnInit {

  @Output()
  public ngInit: EventEmitter<any> = new EventEmitter();

  ngOnInit() {
    window.requestAnimationFrame(_ => {
      this.ngInit.emit()
    })
  }
}