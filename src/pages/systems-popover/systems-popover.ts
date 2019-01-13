import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { BarcodeData } from '../../providers/barcodeData';
import { QR_Scanner } from '../../providers/qr_scan';

@Component({
  selector: 'page-systems-popover',
  templateUrl: 'systems-popover.html'
})
export class PopoverPage {
  popoverSystemsItemList = [{ name: 'Greywater System' }, { name: 'Rainwater System' }, { name: 'GR System' }, { name: 'Irrigation System'}];
  popoverConfigItemList = [{ name: 'Scan QR Code' }, { name: 'Manual Configuration' }];
  manualConfigItemList = [{ name: 'By System ID' }, { name: 'Contact Greenchain' }];
  show_P_One: boolean;
  show_P_Two: boolean;
  show_P_Three: boolean;
  systems: Array<{ system: string, model: string, component: any, picture: string }>;
  private scannedCode;
  constructor(
    public viewCtrl: ViewController,
    public qr: QR_Scanner,
  ) {
    this.systems = [];
    this.show_P_One =   true;
    this.show_P_Two = false;
    this.show_P_Three =   false;
    this.scannedCode = "No Data";
  }
  chooseSystemType(choice) {
    this.show_P_Two = true;
    this.show_P_One = false;
  }
  systemTest(choice){
    console.log("Cool, your choice is:");
    console.log(choice);
  }
  systemConfig(choice) {
    switch (choice) {
      case 'Scan QR Code':
        this.qr.scanCode();
        //this.api.attemptActivate("4890e3ec266f37fc50523a5512df2226670c493dffb90f60484e031647c6a765", "USER_DEMO_ID");
        //this.scannedCode = data;
        //let id = "4890e3ec266f37fc50523a5512df2226670c493dffb90f60484e031647c6a765";
        //this.api.attemptActivate(id);
        break;
      case 'Manual Configuration':
        this.show_P_Two = false;
        this.show_P_Three = true;
        break;
    }
  }
  toManualConfig(choice) {
    switch (choice) {
      case 'By System ID':
        console.log("Manual Config by System ID chosen");
        break;
      case 'Contact Greenchain':
        console.log('Contact Greenchain chosen');
        break;
    }
  }


}
