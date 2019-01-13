import { Component } from '@angular/core';
import {
  NavController, NavParams,
  ToastController, Platform,
  Tabs, LoadingController
} from 'ionic-angular';
import { AngularFireDatabase } from "angularfire2/database";
import { SystemDataProvider } from "../../providers/system-data/system-data";
import { SessionDataProvider } from "../../providers/session-data/session-data";
import { SystemArgumentsProvider } from '../../providers/system-arguments/systemArguments.service';
import {
  System_IF,
  ClientProfile_IF,
  displayable_System_IF,
  System_OverviewArgs_IF,
} from "../../interfaces/interfaces_all";
// Tab Pages
import { SystemOverviewPage } from "./tabs/overview/overview.component";
import { SystemHistoryPage } from "./tabs/history/history.component";
import { SystemManagePage } from "./tabs/manage/manage.component";
// Settings Revamped
import { SettingsPageRevamped } from '../../pages/settingsRev/settingsRev.component';
import { GC_MQTT_Service } from '../../providers/gc-mqtt/gc-mqtt.service';
@Component({
  selector: 'generic-system',
  templateUrl: 'genericSystem.html',
})
export class GenericSystem {
  private sargs: System_OverviewArgs_IF = {} as System_OverviewArgs_IF;
  private displayableSystem: displayable_System_IF;
  private maintenance_ModeActive: boolean = true;
  private brokerConnection: boolean;
  private systemOnline: boolean;
  private canShowOverview: boolean = false;

  // System Page Components
  public overview: any = SystemOverviewPage;
  public history: any = SystemHistoryPage;
  public manage: any = SystemManagePage;
  constructor(
    private navParams: NavParams,
    private mqtt: GC_MQTT_Service,
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private systemData: SystemDataProvider,
    private sargsProvider: SystemArgumentsProvider,
  ) {
    this.navParams = navParams;
    this.sargs = this.navParams.get('sargs')
    this.displayableSystem = this.sargs.displayableSystem;
    this.check_Connectivity();
  }
  ionViewDidLoad(){
    console.log("View did load, Generic System")
    this.sargsProvider.update_Sargs(this.sargs);
    this.canShowOverview = true;
  }
  /*
    Private Functions
  */
  // SYSTEM CONNECTIVITY
  private check_Connectivity(){
    let system = this.sargs.displayableSystem.system;
    if(system){
      this.mqtt.get_Broker_Online_BS().take(1).subscribe( brokerOnline => {
        if(brokerOnline){
          this.mqtt.pingSystem(system);
        }
      })
    }
  }
  // SETTINGS PAGE
  private configure(system: System_IF){
    let SettingsLoader = this.loadingCtrl.create({
      content: "Fetching System Settings...",
    });
    //SettingsLoader.present();
    //this.systemData.get_Specific_System_Settings(system.GSID).subscribe( settings => {
    //  SettingsLoader.dismiss();
      this.navCtrl.push( SettingsPageRevamped, { System: system })
    //})
  }
}
