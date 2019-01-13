import { Component } from '@angular/core';
import {
  NavController, NavParams, ToastController, LoadingController, Loading,
  PopoverController, ModalController, AlertController, ActionSheetController
} from 'ionic-angular';
import { System_IF, Schedule_IF } from '../../../../interfaces/interfaces_all';
import { SystemSchedulesProvider } from '../../../../providers/system-schedules/system-schedules';
import { AddScheduleComponent } from './components/addSchedule/addSchedule.component';
import { Observable } from 'rxjs/Rx';
@Component({
  selector: 'page-scheduling-settings',
  templateUrl: 'scheduling.html'
})
export class SchedulingSettings {
  private system: System_IF;
  private selectedDay: string = null;
  private schedules$: Observable<any[]>;
  private scheduleObjects: Array<Schedule_IF>;
  private displayableSchedules: Array<displayableSchedule>;
  private schedulesSet: boolean = false;
  // UI Stuff
  public loader: Loading;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public loadingCtrl: LoadingController,
    private schedulingSP: SystemSchedulesProvider,
  ) {
    this.system = this.navParams.get('System');
    this.initialize();
  }
  private initialize() {
    if (this.system) {
      this.loader = this.loadingCtrl.create({
        content: 'Fetching schedules...'
      });
      this.loader.present();
      this.schedules$ = this.schedulingSP.retrieve_System_Schedules(this.system);
      this.schedules$.map(schedules => this.mapSchedules(schedules))
        .subscribe();
    }
  }
  private mapSchedules(_schedules: Array<any>) {
    let schedules: Array<any> = [];
    for(let _schedule in _schedules){
      if(_schedule == "$key"){
        continue;
      }
      _schedules[_schedule].$key = _schedule
      schedules.push(_schedules[_schedule]);
    }
    console.log("New scheduleobject s", schedules)
    this.scheduleObjects = [];
    let temp;
    console.log(this.system.system_model)
    switch (this.system.system_model) {
      case "Bush Shrike":
        temp = schedules.filter(schedule => {
          return schedule.$key == 'i';
        })
        this.populate_Schedule_Objects(temp)
        break;
      case "Fish Eagle":
        temp = schedules.filter(schedule => {
          return schedule.$key == 'g' || schedule.$key == 'b' || schedule.$key == 'r';
        })
        this.populate_Schedule_Objects(temp)
        break;
    }
    this.checkForSchedules();
  }
  private populate_Schedule_Objects(schedules) {
    let scheduleObjects = schedules.
      map(_schedule => {
        let schedule = {} as Schedule_IF;
        schedule.type = _schedule.type;
        schedule.days = _schedule.days;
        schedule.hour = _schedule.hour;
        schedule.minutes = _schedule.minutes;
        return schedule as Schedule_IF;
      })
      console.log("Schedule Objects", this.scheduleObjects)
    this.scheduleObjects = scheduleObjects;
  }
  private checkForSchedules() {
    if (this.scheduleObjects) {
      this.displayableSchedules = [];
      switch (this.system.system_model) {
        case "Bush Shrike":
        case "Fish Eagle":
          this.scheduleObjects.forEach(schedule => {
            console.log("Schedule Type", schedule.type)
            console.log("Schedule days", schedule.days)
            console.log("Schedule hour", schedule.hour)
            console.log("Schedule Minutes", schedule.minutes)
            if (schedule.days && schedule.hour != undefined && schedule.minutes != undefined && schedule.type) {
              console.log("Mapping to system schedules displayable")
              this.displayableSchedules = this.mapObjectsToDisplayableSchedules();
              this.schedulesSet = true;
              this.loader.dismiss().catch(() => {});
            }
          })
          if(this.scheduleObjects.length == 0){
            this.loader.dismiss().catch(() => {});
            this.schedulesSet = false;
          }
      }
    }
  }
  private mapObjectsToDisplayableSchedules(): Array<displayableSchedule> {
    let displayableSchedules: Array<displayableSchedule> = [];
    displayableSchedules = this.scheduleObjects.map(schedule => {
      let ds: displayableSchedule = {} as displayableSchedule;
      if (schedule.name) {
        ds.name = schedule.name;
      } else {
          ds.name = this.generateDisplayableName(schedule.type);
      }
      ds.type = schedule.type;
      ds.dayDescription = this.generateDisplayableDays(schedule.days);
      ds.time = this.generateDisplayableTime(schedule.hour, schedule.minutes);
      console.log("Displayuable schedules", ds);
      return ds;
    })
    return displayableSchedules;
  }
  private generateDisplayableTime(_hour: number, quadrant: number){
    let hour: string;
    if(String(_hour).length == 1){
      hour = "0" + _hour;
    }else{
      hour = String(_hour);
    }
    let dispTime: string = hour + ":";
    let minutes: string;
    console.log("Quadrant", quadrant)
    switch(quadrant){
      case 0:
        minutes = "00";
        break;
      case 1:
        minutes = "15";
        break;
      case 2:
        minutes = "30";
        break;
      case 3:
        minutes = "45";
        break;
    }
    dispTime = dispTime.concat(minutes);
    console.log("DISPLAY TIME", dispTime);
    return dispTime;
  }
  private generateDisplayableName(scheduleType: string){
    switch(scheduleType){
      case "i":
        return "Irrigation";
      case "g":
        return "Greywater Circulation";
      case "r":
       return "Rainwater Circulation";
      case "b":
        return "Filter Auto Clean"
      default:
        return "Unnamed"
    }
  }
  private generateDisplayableDays(_days: Array<any>) {
    let days: Array<string> = [];
    let displayableDays: string = '';
    _days.forEach(_day => {
      let dayString = this.getdayString(_day);
      days.push(dayString);
    })
    let numberDays = days.length;
    days.forEach( (_dayString, index) => {
      if(index == 0){
        displayableDays = displayableDays.concat(_dayString + ', ');
      }
      else if(index == numberDays - 1){
        displayableDays = displayableDays.concat(_dayString.toLowerCase());
      }else{
        displayableDays = displayableDays.concat(_dayString.toLowerCase() + ', ');
      }
    })
    return displayableDays;
  }
  private getdayString(day: number) {
    switch (day) {
      case 0:
        return "Sunday";
      case 1:
        return "Monday";
      case 2:
        return "Tuesday";
      case 3:
        return "Wednesday";
      case 4:
        return "Thursday";
      case 5:
        return "Friday";
      case 6:
        return "Saturday";
    }
  }
  presentScheduleEditAlert(dispSchedule: displayableSchedule){
    console.log("should we be EDiting displayable schedule", dispSchedule)
    let alert = this.alertCtrl.create({
      title: "What would you like to do?",
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Edit',
          handler: data => {
            this.editSchedule(dispSchedule);
          }
        }
      ]
    }).present();
  }
  private editSchedule(dispSchedule: displayableSchedule){
    let scheduleObject: Schedule_IF = this.scheduleObjects.find(_schedule => {
      _schedule.type = this.convertTypetoCode(_schedule.type);
      return dispSchedule.type == _schedule.type;
    })
    console.log("THE SCHEDULE OBJECT IS", scheduleObject)
    if(scheduleObject){
      let addScheduleModal = this.modalCtrl.create(AddScheduleComponent, { System: this.system, toEdit: scheduleObject })
      addScheduleModal.onDidDismiss(_newSchedule => {
        if (_newSchedule) {
          console.log("THE NEW SChEDULE", _newSchedule)
          let newSchedule: Schedule_IF = _newSchedule.newSchedule as Schedule_IF;
          let loader = this.loadingCtrl.create({
            content: 'Saving new schedule...'
          });
          loader.present();
          this.schedulingSP.add_New_Schedule_To_Firebase(this.system, newSchedule, loader);
        }else{
          // Do nothing
        }
      })
      addScheduleModal.present();
    }
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
      default:
        return type;
    }
  }
  private deleteSchedule(dispSchedule: displayableSchedule){
    let scheduleObject: Schedule_IF = this.scheduleObjects.find(_schedule => {
      return this.convertTypetoCode(dispSchedule.type) == this.convertTypetoCode(_schedule.type);
    })
    scheduleObject.type = this.convertTypetoCode(scheduleObject.type);
    this.schedulingSP.deleteSchedule(this.system, scheduleObject);
  }
  private newSchedule() {
    console.log("Adding a new schedule")
    let addScheduleModal = this.modalCtrl.create(AddScheduleComponent, { System: this.system })
    addScheduleModal.onDidDismiss(_newSchedule => {
      console.log("THE NEW SCHEDULE IS", _newSchedule)
      if (_newSchedule.newSchedule) {
        let newSchedule: Schedule_IF = _newSchedule.newSchedule as Schedule_IF;
        let loader = this.loadingCtrl.create({
          content: 'Saving new schedule...'
        });
        loader.present();
        this.schedulingSP.add_New_Schedule_To_Firebase(this.system, newSchedule, loader);
      }
    })
    addScheduleModal.present();
  }
  /*
  DEBUGGING
  */
  private test() {
    console.log(this.scheduleObjects);
    //this.schedulingSP.retrieve_System_Schedules(th)
  }

}
interface displayableSchedule {
  name: string;
  type: string;
  dayDescription: string;
  time: string;
}
