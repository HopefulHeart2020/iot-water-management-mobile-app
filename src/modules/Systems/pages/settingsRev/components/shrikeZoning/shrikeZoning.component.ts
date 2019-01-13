import { Component } from '@angular/core';
import {
  NavController, NavParams, ToastController, LoadingController, ItemSliding,
  PopoverController, ModalController, AlertController, ActionSheetController
} from 'ionic-angular';
import {
  System_IF,
  SystemInterface,
  settingsOption,
  BushShrike_Settings_IF,
  Shrike_Settings_IF,
  SingleZoneSettings_IF
} from '../../../../interfaces/interfaces_all';
import { SettingsServiceRevamped } from '../../../../providers/system-settings/settingsRev.service';
import { Observable } from 'rxjs/Rx';

@Component({
  selector: 'page-shrike-zoning',
  templateUrl: 'shrikeZoning.html'
})
export class ShrikeZoningSettings {
  private isReady: boolean = false;
  private system: System_IF;
  private settings$: Observable<any>;
  private settings: BushShrike_Settings_IF;
  private section: string = 'zoning';
  private showDisabledZones: boolean = true;
  // Subscriptions
  private settingsSubscription$;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public settings_SP: SettingsServiceRevamped,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public asCtrl: ActionSheetController,
    public loadingCtrl: LoadingController
  ) {
    this.system = this.navParams.get('System') as System_IF;
    this.get_Settings();
  }
  ngOnDestroy() {
    this.settingsSubscription$.unsubscribe();
  }
  // PRIVATE FUNCTIONS //
  private save_Changes() {
    this.settings_SP.update_BushShrike_Settings(this.system, this.settings);
    this.settings_SP.update_Controller_Settings(this.system, this.settings);
  }
  private editZone_AS(zone: SingleZoneSettings_IF) {
    let disabled_OR_enabled: string = "Disable";
    let time_OR_mode: string = "Change Mode";
    let toggle_t_Or_m: string = "Use Specific Time";
    if (!zone.enabled) {
      disabled_OR_enabled = "Enable";
    }
    if (zone.time_not_mode && zone.time_minutes) {
      time_OR_mode = "Edit Specific Time";
      toggle_t_Or_m = "Use Mode";
    }
    let actionSheet = this.asCtrl.create({
      title: 'Edit Zone',
      buttons: [
        {
          text: disabled_OR_enabled,
          role: 'destructive',
          handler: () => {
            this.toggle_Zone(zone);
            console.log('Destructive clicked');
          }
        }, {
          text: 'Name Zone',
          handler: () => {
            this.name_Zone(zone);
          }
        }, {
          text: time_OR_mode,
          handler: () => {
            switch (time_OR_mode) {
              case "Edit Specific Time":
                this.edit_Specific_Time(zone);
                break;
              case "Change Mode":
                this.edit_Mode(zone);
                break;
            }
          }
        }, {
          text: toggle_t_Or_m,
          handler: () => {
            zone.time_not_mode = !zone.time_not_mode;
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }
  private reorderZones(indexes) {
    let element = this.settings.BushShrikeSettings.zones[indexes.from];
    this.settings.BushShrikeSettings.zones.splice(indexes.from, 1);
    this.settings.BushShrikeSettings.zones.splice(indexes.to, 0, element);
  }
  private getZoneColour(isEnabled: boolean) {
    if (isEnabled) {
      return 'primary';
    } else {
      return 'danger';
    }
  }
  private get_Settings() {
    let SettingsLoader = this.loadingCtrl.create({
      content: "Fetching System Settings...",
    });
    SettingsLoader.present();
    this.settings$ = this.settings_SP.get_System_Settings(this.system);
    this.settingsSubscription$ = this.settings$.map(settings => {
      console.log("SETTINGS 2", settings)
      this.settings = settings;
      SettingsLoader.dismiss();
      this.isReady = true;
    }).subscribe();
  }
  // Zone Editing Functions //
  private toggleFnShowDisabledZones() {
    this.showDisabledZones = !this.showDisabledZones;
  }

  private edit_Specific_Time(zone: SingleZoneSettings_IF) {
    console.log("Adding specific time for zone: ", zone)
    let placeholder: string = String(zone.time_minutes);
    if (!placeholder) {
      placeholder = "5";
    }
    let add_Time_Alert_Content = {
      title: "Configure Specific Time.",
      subTitle: "How long should we irrigate" + zone.name + " for?",
      inputs: [
        {
          name: 'specific_time',
          placeholder: placeholder,
          type: 'number'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Okay',
          handler: data => {
            console.log('Time Saved clicked', data.specific_time);
            zone.time_minutes = data.specific_time;
            zone.time_not_mode = true;
          }
        }
      ]
    };
    let alert = this.alertCtrl.create(add_Time_Alert_Content);
    alert.present();
  }
  private edit_Mode(zone: SingleZoneSettings_IF) {
    let change_Mode_Alert_Content = {
      title: "Configure Mode",
      subTitle: "What mode should we set " + zone.name + " to?",
      buttons: [
        {
          text: 'Eco',
          handler: data => {
            // Set Zone to Eco
            zone.mode = "E";
          }
        },
        {
          text: "Standard",
          handler: data => {
            // Set Zone to Standard
            zone.mode = "S";
          },
        },
        {
          text: 'Manic',
          handler: data => {
            // Set Zone to Manic
            zone.mode = "M";
          }
        },
        {
          text: 'Cancel',
          role: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
      ]
    };
    let alert = this.alertCtrl.create(change_Mode_Alert_Content);
    alert.present();
  }
  private toggle_Zone(zone: SingleZoneSettings_IF) {
    zone.enabled = !zone.enabled;
  }
  private name_Zone(zone: SingleZoneSettings_IF) {
    let change_Name_Alert_Content = {
      title: "What name would you like to give to zone '" + zone.name + "'",
      inputs: [
        {
          name: 'new_name',
          placeholder: 'e.g. Back Garden'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Okay',
          handler: data => {
            console.log('Name Saved clicked');
            zone.name = data.new_name;
            console.log("NEW ZONE", zone)
          }
        }
      ]
    };
    let alert = this.alertCtrl.create(change_Name_Alert_Content);
    alert.present();
  }
  /*
  Mode Editing Functions
  */
  private edit_Mode_Time(mode, item: ItemSliding) {
    let longName = this.get_Mode_Long_Name(mode);
    let change_Mode_Time_Alert_Content = {
      title: "Choose minutes",
      subTitle: "How long should mode " + longName + " irrigate for?",
      inputs: [
        {
          name: 'new_time',
          placeholder: '5',
          type: 'number',
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
            item.close();
          }
        },
        {
          text: 'Okay',
          handler: data => {
            console.log('Name Saved clicked');
            this.settings.BushShrikeSettings.mode_minutes[mode] = parseInt(data.new_time);
            item.close();
          }
        }
      ]
    };
    let alert = this.alertCtrl.create(change_Mode_Time_Alert_Content);
    alert.present();
  }
  private get_Mode_Long_Name(mode: string) {
    switch (mode) {
      case "E":
        return "Economic";
      case "S":
        return "Standard";
      case "M":
        return "Manic";
    }
  }
}
