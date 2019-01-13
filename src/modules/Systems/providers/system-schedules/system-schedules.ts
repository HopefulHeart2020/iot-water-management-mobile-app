import { Injectable } from '@angular/core';
import { Loading } from 'ionic-angular';
import 'rxjs/add/operator/map';
import { AngularFireDatabase } from "angularfire2/database";
import {
  System_IF,
  Schedule_IF,
} from '../../interfaces/interfaces_all';
import { SETTINGS_PATHS } from "./settingsRev.globals";
import { Observable } from 'rxjs/Rx';

@Injectable()
export class SystemSchedulesProvider {
  private schedulepath: string = "systems_scheduler/gw/";
  constructor(private db: AngularFireDatabase) {

  }
  private mapSchedule_To_Firebase_Object(scheduleObject: Schedule_IF): firebaseScheduleObject_IF {
    console.log("ORIGINAL ScHEDULE OBJECT BEFORE MAPPING", scheduleObject)
    let fb_ScheduleObject: firebaseScheduleObject_IF = {} as firebaseScheduleObject_IF;
    fb_ScheduleObject.days = this.convertDayArraytoNumeric(scheduleObject.days);
    fb_ScheduleObject.hour = scheduleObject.hour;
    fb_ScheduleObject.minutes = scheduleObject.minutes;
    fb_ScheduleObject.type = this.convertTypetoCode(scheduleObject.type);
    return fb_ScheduleObject;
  }
  private convertTypetoCode(type: string){
    switch(type){
      case "Irrigation":
        return "i";
      case "Greywater Circulation":
        return "g";
      case "Rainwater Circulation":
        return "r";
      case "Filter Auto Clean":
        return "b";
    }
  }
  private convertDayArraytoNumeric(_days: Array<string>): Array<number> {
    let days: Array<number> = _days.map(day => {
      return parseInt(day);
    })
    console.log("Converted Days?", days)
    return days;
  }
  public retrieve_System_Schedules(system: System_IF): Observable<any[]> {
    let ref$ = this.db.object(this.schedulepath + system.GSID).snapshotChanges()
    .map( scheduleSnapshot => {
      const $key = scheduleSnapshot.payload.key;
      const data = { $key, ...scheduleSnapshot.payload.val() };
      return data;
    })
    return ref$;
  }
  public add_New_Schedule_To_Firebase(system: System_IF, newSchedule: Schedule_IF, loader: Loading) {
    let fbObject = this.mapSchedule_To_Firebase_Object(newSchedule);
    if (fbObject) {
      let path = this.schedulepath + system.GSID + '/' + newSchedule.mqttCommand;
      let ref$: Observable<firebaseScheduleObject_IF>;
      this.db.object(path).update(fbObject)
    }
    loader.dismiss();
  }
  public deleteSchedule(system: System_IF, schedule: Schedule_IF) {
    let path = this.schedulepath + system.GSID + '/' + schedule.type;
    let ref$: Observable<firebaseScheduleObject_IF>;
    console.log("DELETING SCHEDULE, PATH IS", path)
    this.db.object(path).remove()
  }
}
interface firebaseScheduleObject_IF {
  days: Array<number>;
  hour: number;
  minutes: number;
  type: string;
}
