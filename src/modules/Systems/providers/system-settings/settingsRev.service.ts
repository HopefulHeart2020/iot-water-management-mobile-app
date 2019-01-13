import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { AngularFireDatabase } from "angularfire2/database";
import {
  System_IF,
  Generic_SystemSettings_IF,
  GreyHeron_Settings_IF,
  RainFalcon_Settings_IF,
  FishEagle_Settings_IF,
  BushShrike_Settings_IF,
  SingleZoneSettings_IF,
  minutesPerMode_IF
} from '../../interfaces/interfaces_all';
import { SETTINGS_PATHS } from "./settingsRev.globals";
import { GC_MQTT_Service } from '../../providers/gc-mqtt/gc-mqtt.service';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class SettingsServiceRevamped {

  constructor(
    private db: AngularFireDatabase,
    private mqtt: GC_MQTT_Service,
  ) {

  }
  // PRIVATE FUNCTIONS //
  private retrieve_FishEagle_Settings(gsid: string): Observable<FishEagle_Settings_IF> {
    let ref$: Observable<FishEagle_Settings_IF>;
    ref$ = this.db.object(SETTINGS_PATHS.TESTING_SETTINGS + gsid).valueChanges();
    return ref$;
  }
  private retrieve_BushShrike_Settings(gsid: string) {
    let ref$: Observable<BushShrike_Settings_IF>;
    ref$ = this.db.object(SETTINGS_PATHS.TESTING_SETTINGS + gsid).valueChanges();
    return ref$;
  }
  private retrieve_Linked_Systems_For_GSID(gsid: string) {
    let ref$: Observable<any>;
    ref$ = this.db.object(SETTINGS_PATHS.LINKED_SYSTEMS + gsid).valueChanges();
    return ref$;
  }
  private getMinutes(zone: SingleZoneSettings_IF, modeTimes: minutesPerMode_IF): number {
    if (zone.time_not_mode && (zone.time_minutes != undefined)) {
      return zone.time_minutes
    } else {
      switch (zone.mode) {
        case "E":
          return modeTimes.E;
        case "S":
          return modeTimes.S;
        case "M":
          return modeTimes.M;
      }
    }
  }
  public create_Shrike_SettingsString(system: System_IF, updatedSettings: BushShrike_Settings_IF) {
    let CtrlString: string;
    let settings = updatedSettings.BushShrikeSettings;
    if (system.system_model == "Bush Shrike") {
      CtrlString = "Si";
      console.log("Creating controller settings string for Bush Shrike");
      console.log("System", system);
      console.log("Settings", updatedSettings);
      for (let zone of settings.zones) {
        if (!zone.enabled) {
          continue
        }
        let minutes = this.getMinutes(zone, settings.mode_minutes);
        CtrlString = CtrlString.concat(String.fromCharCode(minutes));
        CtrlString = CtrlString.concat(zone.id.toLowerCase());
      }
      CtrlString = CtrlString.concat('s');
      switch (settings.sources.source) {
        case "rainwater":
        case "greywater":
        case "auto":
          CtrlString = CtrlString.concat('G');
          break;
        case "municipal":
          CtrlString = CtrlString.concat('M');
          break;
        default:
          CtrlString = CtrlString.concat('G');
          break;
      }
      this.retrieve_Linked_Systems_For_GSID(system.GSID).subscribe(linkedGSIDs => {
        if (linkedGSIDs) {
          console.log("LInked GSIDs", linkedGSIDs)
          CtrlString = CtrlString.concat('l');
          if (Array.isArray(linkedGSIDs)) {
            linkedGSIDs.forEach(gsid => {
              let temp = String(gsid);
              CtrlString = CtrlString.concat(temp);
            })
          }
          else {
            let temp = String(linkedGSIDs.$value);
            CtrlString = CtrlString.concat(temp);
          }

        }
        if (this.mqtt.connected) {
          let topic = system.GSID + "/S"
          this.mqtt.sendMessage(CtrlString, topic);
        }
      })
    } else {
      CtrlString = null;
    }
  }
  // PUBLIC FUNCTIONS //
  public get_System_Settings(system: System_IF) {
    switch (system.system_model) {
      case "Bush Shrike":
        return this.retrieve_BushShrike_Settings(system.GSID);
      case "Fish Eagle":
        return this.retrieve_FishEagle_Settings(system.GSID);
      default:
        return
    }
  }
  public update_BushShrike_Settings(system: System_IF, updatedSettings: BushShrike_Settings_IF) {
    if (system.system_model != "Bush Shrike") {
      console.log("Could not update settings, system not a Bush Shrike");
    } else {
      let ref$: Observable<BushShrike_Settings_IF>;
      this.db.object(SETTINGS_PATHS.TESTING_SETTINGS + system.GSID).update(updatedSettings)
    }
  }
  public update_Shrike_Source(system: System_IF, source: string) {
    if (system.system_model != "Bush Shrike") {
      console.log("Could not update settings, system not a Bush Shrike");
    } else {
      let ref$: Observable<BushShrike_Settings_IF>;
      this.db.object(SETTINGS_PATHS.TESTING_SETTINGS + system.GSID + "/BushShrikeSettings/sources/").
        update({
          source: source,
        });
    }
  }
  public update_Controller_Settings(system: System_IF, updatedSettings: BushShrike_Settings_IF) {
    this.create_Shrike_SettingsString(system, updatedSettings);
  }
}
