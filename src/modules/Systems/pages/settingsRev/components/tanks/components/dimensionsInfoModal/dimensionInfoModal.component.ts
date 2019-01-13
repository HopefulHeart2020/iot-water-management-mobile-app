import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavParams, ViewController, NavController } from 'ionic-angular';

@Component({
  selector: 'modal-dimensions-info',
  templateUrl: 'dimensionInfoModal.html'
})
export class DimensionInfoModal {
  constructor(
    private navCtrl: NavController,
    public viewCtrl: ViewController
  ) {

  }
  // HOOK FUNCTIONS //
  ngOnDestroy() {

  }
  // PRIVATE FUNCTIONS //
  private close(){
    this.viewCtrl.dismiss();
  }
}
