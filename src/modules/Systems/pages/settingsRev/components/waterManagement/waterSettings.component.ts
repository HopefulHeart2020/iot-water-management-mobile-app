import { Component } from '@angular/core';
import {
  NavController, NavParams, ToastController, LoadingController, Loading,
  PopoverController, ModalController, AlertController, ActionSheetController
} from 'ionic-angular';
import { System_IF,
         BushShrike_Settings_IF,
         FishEagle_Settings_IF,
         WaterSources,
        } from "../../../../interfaces/interfaces_all";
import { SettingsServiceRevamped } from '../../../../providers/system-settings/settingsRev.service';
import { Observable } from 'rxjs/Rx';
@Component({
  selector: 'page-water-settings',
  templateUrl: 'waterSettings.html'
})
export class WaterManagementSettings {
  private system: System_IF;
  private isReady: boolean = false;
  private selectedSource: string;
  private settings: any;
  private loader: Loading;
  constructor(
    private settingsService: SettingsServiceRevamped,
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public loadingCtrl: LoadingController
  ) {
    this.system = this.navParams.get('System');
    this.initialize();
  }
  private initialize(){
    this.loader = this.loadingCtrl.create({
      content: "Fetching Source Settings..."
    });
    this.loader.present();
    let ref$: Observable<any>;
    ref$ = this.settingsService.get_System_Settings(this.system);
    ref$.subscribe( _settings => {
      let settings;
      switch(this.system.system_model){
        case "Bush Shrike":
          this.settings = _settings as BushShrike_Settings_IF;
          this.selectedSource = this.settings.BushShrikeSettings.sources.source;
          console.log("SETTINGS", settings)
          break;
        case "Fish Eagle":
          this.settings = _settings as FishEagle_Settings_IF;
          break
      }
      this.isReady = true;
      this.loader.dismiss();
      console.log("SELECTED SOURCE", this.selectedSource)
    })
  }
  private save_Changes(){
    this.settingsService.update_Shrike_Source(this.system, this.selectedSource)
    this.settingsService.create_Shrike_SettingsString(this.system, this.settings)
  }
}
