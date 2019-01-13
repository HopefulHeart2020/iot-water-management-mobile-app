import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Platform } from 'ionic-angular';

import { BarcodeScanner  } from '@ionic-native/barcode-scanner';
import { AlertController } from 'ionic-angular';
/*
  GSID: Greenchain Systems ID

*/
@Injectable()
export class QR_Scanner {
  private scannedData;
  private UID: string;
  constructor(
    private scanner: BarcodeScanner,
    private platform: Platform,
    private alertCtrl: AlertController,
  ) {
    console.log('Inside QR Scanner class');
    this.UID = "DEMO_USER_ID";
  }

  scanCode() {
    this.scanner.scan()
      .then((result) => {
          this.scannedData = result.text;
          //this.scannedData = this.api.attemptActivate(result.text,this.UID);
      })
      .catch((error) => {
        alert(error);
      })

  }

  getScannedData() {
    return this.scannedData;
  }

}
