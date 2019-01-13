/*import { Directive, ElementRef, Input, OnInit, OnDestroy } from 'angular2/core';
import { Gesture } from 'ionic-angular/gestures/gesture';

@Directive({
  selector: '[longPress]'
})
export class PressDirective implements OnInit, OnDestroy {
  el: HTMLElement;
  pressGesture: Gesture;

  constructor(el: ElementRef) {
    this.el = el.nativeElement;
  }

  ngOnInit() {
    this.pressGesture = new Gesture(this.el);
    this.pressGesture.listen();
    this.pressGesture.on('press', e => {
      console.log('pressed!!');
    })
  }

  ngOnDestroy() {
    this.pressGesture.destroy();
  }
}*/
