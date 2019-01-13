import { Component } from '@angular/core';
import {
  NavController, NavParams, ToastController, ViewController,
  PopoverController, ModalController, AlertController, ActionSheetController
} from 'ionic-angular';
import { System_IF, Schedule_IF } from '../../../../../../interfaces/interfaces_all';
import { SystemSchedulesProvider } from '../../../../../../providers/system-schedules/system-schedules';
import { ScheduleTimePicker } from './timePicker';
import { TPTEST } from "../timePickerTest/tpTest";
import { Observable } from 'rxjs/Observable';
@Component({
  selector: 'modal-scheduling-add',
  templateUrl: 'addSchedule.html'
})
export class AddScheduleComponent {
  private system: System_IF;
  private newSchedule: Schedule_IF = {} as Schedule_IF;
  private allowedScheduleTypes: Array<AllowedScheduleType_IF>;
  // UI
  private timePickerValues = ScheduleTimePicker;
  private rawTimePicked: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public viewCtrl: ViewController,
    public alertCtrl: AlertController,
    private schedulingSP: SystemSchedulesProvider,
  ) {
    this.system = this.navParams.get('System');
    this.checkForEditingExistingSchedule();
    this.allowedScheduleTypes = this.determine_Allowed_ScheduleTypes();
  }
  private checkForEditingExistingSchedule(){
    let isExisting = this.navParams.get("toEdit");
    if(isExisting){
      let existingSchedule: Schedule_IF = isExisting as Schedule_IF;
      this.newSchedule = existingSchedule;
      this.newSchedule.type = this.convertFromScheduleTypeCode(this.newSchedule.type);
      this.convertExistingTime_To_Displayable_RawTime();
      console.log("EXISTING SCHEDULE", this.newSchedule)
    }
  }
  private convertFromScheduleTypeCode(code: string){
    switch(code){
      case 'i':
        return "Irrigation";
      case 'g':
        return "Greywater Circulation";
      case 'r':
        return "Greywater Circulation";
      default:
        return code;
    }
  }
  private saveSchedule() {
    this.populateMQTT_Command();
    if (this.scheduleValidToSave()) {
      this.gather_and_SetNewSchedule();
      console.log("Valid Schedule to Save");
      this.viewCtrl.dismiss({ newSchedule: this.newSchedule })
    } else {
      const alert = this.alertCtrl.create({
        title: 'Please fill in all fields',
        subTitle: "It seems you've left something out",
        buttons: ['Dismiss']
      });
      alert.present();
    }
  }
  private scheduleValidToSave(): boolean {
    let isValid: boolean = false;
    console.log(this.rawTimePicked)
    if (this.newSchedule.days && this.newSchedule.type
      && this.rawTimePicked != undefined
      && this.newSchedule.mqttCommand) {
      isValid = true;
    }
    return isValid;
  }
  private gather_and_SetNewSchedule(){
    let convertedTime: scheduleTime = this.convert_Raw_Time_String(this.rawTimePicked);
    this.newSchedule.hour = convertedTime.hour;
    this.newSchedule.minutes = convertedTime.quadrant;
    this.populateMQTT_Command();
  }
  private populateMQTT_Command() {
    let mqttCommand: string;
    let temp = this.allowedScheduleTypes.map(type => {
      if (type.name == this.newSchedule.type) {
        mqttCommand = type.mqttCommand;
      }
    });
    this.newSchedule.mqttCommand = mqttCommand;
  }
  private convert_Raw_Time_String(rawTimePicked: string): scheduleTime {
    let hour: number = parseInt(rawTimePicked.slice(0, 2));
    console.log("NEW HOUR", hour);
    let quadrant: number = parseInt(rawTimePicked.slice(-1));
    console.log("NEW Quadrant", quadrant);
    return {
      hour: hour,
      quadrant: quadrant
    } as scheduleTime;
  }
  private convertExistingTime_To_Displayable_RawTime(){
    let rawTime: string = '';
    let hour: string;
    if(String(this.newSchedule.hour).length == 1){
      hour = "0" + this.newSchedule.hour;
    }else{
      hour = String(this.newSchedule.hour)
    }
    rawTime = rawTime.concat(hour + "  " + this.newSchedule.minutes);
    console.log("EXISTING Raw time", rawTime);
    this.rawTimePicked =  rawTime;
  }

  private determine_Allowed_ScheduleTypes(): Array<AllowedScheduleType_IF> {
    if (this.system) {
      let types: Array<AllowedScheduleType_IF> = [];
      switch (this.system.system_model) {
        case "Bush Shrike":
          types = BushShrikeTypes;
          this.newSchedule.type = "Irrigation";
          break;
        case "Fish Eagle":
          types = FishEagleTypes;
          break;
        default:
          break;
      }
      return types
    } else {
      return [];
    }
  }
  private close() {
    this.viewCtrl.dismiss();
  }
}

interface AllowedScheduleType_IF {
  name: string;
  mqttCommand: string;
}
interface scheduleTime {
  hour: number;
  quadrant: number;
}
const BushShrikeTypes: Array<AllowedScheduleType_IF> = [
  {
    name: "Irrigation",
    mqttCommand: 'i'
  },
];
const FishEagleTypes: Array<AllowedScheduleType_IF> = [
  {
    name: "Greywater Circulation",
    mqttCommand: 'g'
  },
  {
    name: "Rainwater Circulation",
    mqttCommand: 'r'
  },
  {
    name: "Filter Auto Clean",
    mqttCommand: 'b'
  },
];
