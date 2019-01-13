import { Component } from '@angular/core';
import {  NavController, NavParams, ToastController,
          PopoverController, ModalController, AlertController,
          ActionSheetController, ViewController
} from 'ionic-angular';
// // Modals
import { ShrikeZoningSettings } from './components/shrikeZoning/shrikeZoning.component';
import { WaterManagementSettings } from './components/waterManagement/waterSettings.component';
import { SchedulingSettings } from './components/scheduling/scheduling.component';
import { TankSettings } from './components/tanks/tanks.component';
// Interfaces
import {  SystemInterface,
          settingsOption } from '../../interfaces/interfaces_all';

@Component({
  selector: 'page-settingsRev',
  templateUrl: 'settingsRev.html'
})
export class SettingsPageRevamped {
  private system: SystemInterface;
  private unmappedSettings: any;
  private options: Array<settingsOption>;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public viewCtrl: ViewController
  ) {
    this.system = this.navParams.get('System');

    switch(this.system.system_model){
      case "Bush Shrike":
      case 'Irrigation':
      case 'irrigation':
        this.options = irrigationOptions;
        break;
      case 'Fish Eagle':
      case 'GRCombo':
      case 'Greywater':
      case 'greywater':
      case 'Rainwater':
      case 'rainwater':
        this.options = waterManagementOptions;
        break;
      default:
        console.log('Not a valid system Model for Settings page');
        break;
    }
  }
  private presentSettingsModal(option: settingsOption){
    switch(option.name){
      case "Zoning":
        this.navCtrl.push( ShrikeZoningSettings, { System: this.system } )
        break;
      case "Scheduling":
        this.navCtrl.push( SchedulingSettings, { System: this.system } )
        break;
      case "Tank Settings":
        this.navCtrl.push( TankSettings, { System: this.system } )
        break;
      case "Sources":
        this.navCtrl.push( WaterManagementSettings, { System: this.system } )
        break;
      default:
        console.log("Oops");
        break;
    }
  }
  private dismiss() {
    this.viewCtrl.dismiss().catch(() => {});
  }
}
const waterManagementOptions: Array<settingsOption> = [
  {
    name: "Scheduling",
    icon: "md-clock",
  },
  {
    name: "Tank Settings",
    icon: "ios-analytics"
  },
  {
    name: "Water Management",
    icon: "ios-water-outline"
  }];
const irrigationOptions: Array<settingsOption> = [
  {
    name: "Scheduling",
    icon: "md-clock"
  },
  {
    name: "Zoning",
    icon: "ios-leaf-outline"
  },
  {
    name: "Sources",
    icon: "ios-options"
  }];
