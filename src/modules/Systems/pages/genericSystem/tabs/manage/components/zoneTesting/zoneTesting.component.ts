import { Component } from '@angular/core';
import {
  NavController, NavParams,
  ToastController, Platform,
  Tabs, LoadingController, ViewController
} from 'ionic-angular';
import {
  System_IF,
  SingleZoneSettings_IF,
} from "../../../../../../interfaces/interfaces_all";
import { GC_MQTT_Service } from '../../../../../../providers/gc-mqtt/gc-mqtt.service';

@Component({
  selector: 'zone-testing',
  templateUrl: 'zoneTesting.html'
})
export class ZoneTestingModal {
  private system: System_IF;
  private zones: Array<SingleZoneSettings_IF>;
  private isReadyToChoose: boolean = false;
  private selectedZone: SingleZoneSettings_IF = null;
  constructor(
    private navParams: NavParams,
    private navCtrl: NavController,
    private viewCtrl: ViewController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private mqtt: GC_MQTT_Service,
  ) {
    this.system = this.navParams.get("System");
    this.zones = this.navParams.get("Zones")
    if(this.zones && this.system){
      this.isReadyToChoose = true;
    }
  }
  // PRIVATE FUNCTIONS
  private beginTest(){
    if(this.selectedZone){
      // console.log("ABOUT TO BEGIN TEST FOR", this.selectedZone)
      let topic = this.system.GSID + "/A";
      let message = this.selectedZone.id.toLowerCase();
      if(this.mqtt.connected){
        this.mqtt.sendMessage(message, topic);
        this.presentToast('Controller has been notified and test should be running')
      }else{
        this.presentToast('Oops. Test cannot be executed. No broker Connection.')
      }
    }
  }
  private selectZone(zone: SingleZoneSettings_IF){
    this.selectedZone = zone;
  }
  private  presentToast(message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }
  private close(){
    this.viewCtrl.dismiss();
  }
}
