import { Component } from '@angular/core';
import {
  NavController, NavParams, ToastController, LoadingController,
  ModalController, AlertController, PopoverController,
} from 'ionic-angular';
import {
  System_IF,
  FishEagle_Settings_IF,
  GreyHeron_Settings_IF,
  RainFalcon_Settings_IF,
  RainRaptor_Settings_IF,
} from '../../../../interfaces/interfaces_all';
import { SettingsServiceRevamped } from '../../../../providers/system-settings/settingsRev.service';
// Modal for Dimensions Info
import { DimensionInfoModal } from './components/dimensionsInfoModal/dimensionInfoModal.component';
import { Observable } from 'rxjs/Rx';
@Component({
  selector: 'page-tanks-settings',
  templateUrl: 'tanks.html'
})
export class TankSettings {
  private system: System_IF;
  private isReady:boolean = false;
  private section: string = "Rainwater";
  private settings: FishEagle_Settings_IF;
  private settings$: Observable<any>;
  // Subscriptions
  private settingsSubscription$;
  // Tank Dimension Specific

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public settings_SP: SettingsServiceRevamped,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public popoverCtrl: PopoverController,
    public loadingCtrl: LoadingController
  ) {
    this.system = this.navParams.get("System");
    this.getSettings();
  }
  // HOOK FUNCTIONS //
  ngOnDestroy() {
    if( this.isReady ){
      this.settingsSubscription$.unsubscribe();
    }
  }
  // PRIVATE FUNCTIONS //
  private getSettings(){
    if(this.system){
        let SettingsLoader = this.loadingCtrl.create({
          content: "Fetching System Settings...",
        });
        SettingsLoader.present();
        this.settings$ = this.settings_SP.get_System_Settings(this.system);
        this.settingsSubscription$ = this.settings$.map(settings => {
          this.settings = settings;
          console.log("SETTINGS", this.settings)
          SettingsLoader.dismiss();
          this.isReady = true;
        }).subscribe();
    }
  }
  private show_Dimension_Info() {
    let modal = this.modalCtrl.create(DimensionInfoModal);
    modal.present();
  }
}
