import { ManagerCommandService } from '../../../../providers/systems-manager/manage.service';
import { SystemDataProvider } from '../../../../providers/system-data/system-data';
import { SettingsServiceRevamped } from '../../../../providers/system-settings/settingsRev.service';
import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import {
  NavController, NavParams, ModalController,
  AlertController, LoadingController, Loading
} from 'ionic-angular';
import {
  System_IF,
  displayable_System_IF,
  System_OverviewArgs_IF,
  SystemCommand_IF,
  SystemCommandsAll_IF,
  GenericSystemObservable_IF,
  BushShrike_Settings_IF,
  SingleZoneSettings_IF,
} from '../../../../interfaces/interfaces_all';
// For Single Zone Testing on Shrike systems
import { ZoneTestingModal } from './components/zoneTesting/zoneTesting.component';

@Component({
  selector: 'page-manage',
  templateUrl: 'manage.html',
})
export class SystemManagePage {
  private systemState: string;
  private system: System_IF;
  private displayableSystem: displayable_System_IF;
  private commands: SystemCommandsAll_IF;

  // UI Related
  private isReady: boolean = false;
  private stateReady: boolean = false;
  public loader: Loading;
  // For Single Zone Testing (Only applicable for shrike systems)
  private zonesToTest: Array<SingleZoneSettings_IF>;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public managerService: ManagerCommandService,
    public settingsService: SettingsServiceRevamped,
    private systemData: SystemDataProvider,
    private modalCtrl: ModalController,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
  ) {
    let sargs = this.navParams.data as System_OverviewArgs_IF;
    this.displayableSystem = sargs.displayableSystem;
    this.system = sargs.displayableSystem.system;
    this.initialize();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Manage System Tab', this.displayableSystem);
  }
  private initialize(){
    this.fetch_Command_Lists();
    this.getSystemState();
  }
  private fetch_Command_Lists() {
    if (!this.displayableSystem) {
      throw new Error("No Displayable System object!")
    } else {
      this.commands = this.managerService.fetchCommands(this.displayableSystem.system);
      this.isReady = true;
    }
  }
  private getSystemState(){
    this.systemData.get_System_State(this.displayableSystem.system.GSID).subscribe(data => {
      if(data.state){
        this.systemState = data.state;
        this.update_Command_Lists_On_State();
        this.stateReady = true;
      }
    })
  }
  private update_Command_Lists_On_State() {
      if (this.systemState) {
        switch (this.displayableSystem.system.system_model) {
          case "Bush Shrike":
            if (this.systemState == "Irrigating") {
              this.change_List_On_Command_Success({ name: "Irrigate Now", mqttMessage: "i" });
            }
            else if (this.systemState == "Idle") {
              this.fetch_Command_Lists();
            }
            break;
          case "Fish Eagle":
            if(this.systemState != "Idle"){
              this.display_Stop_Command_List();
            }else{
              this.fetch_Command_Lists();
            }
            break;
        }
      }
  }
  private display_Stop_Command_List(){
    this.commands.SystemSpecific = [{
      name: "Stop " + this.systemState.toLowerCase(),
      mqttMessage: "s"
    }]
  }
  // UI RElated Function (Alerts, Toasts)
  private presentCertainAlert(command: SystemCommand_IF) {
    console.log("COMMAND TO EXECUTE", command)
    let confirm = this.alertCtrl.create({
      title: 'Are you sure?',
      message: 'Do you want to ' + command.name.toLowerCase() + '?',
      buttons: [
        {
          text: 'No',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            let success = this.attemptExecuteCommand(command);
            // if (success) {
            //   this.change_List_On_Command_Success(command);
            // }
          }
        }
      ]
    });
    confirm.present();
  }
  private change_List_On_Command_Success(command: SystemCommand_IF) {
    console.log("IN CHANGE LIST COMMAND FUNCTION, CURRENT COMMANDS", this.commands)
    let new_SpecificCommands;
    switch (command.name) {
      case "Irrigate Now":
        new_SpecificCommands = this.commands.SystemSpecific.filter(_command => {
          if (_command.name != "Irrigate Now") {
            return true;
          }
        });
        this.commands.SystemSpecific = new_SpecificCommands.concat(commandsWhilstIrrigating);
        break;
      case "Pause Irrigation":
        new_SpecificCommands = this.commands.SystemSpecific.filter(_command => {
          if (_command.name != "Pause Irrigation" && _command.name != "Stop Irrigation") {
            return true;
          }
        });
        this.commands.SystemSpecific = new_SpecificCommands.concat(commandsWhilstIrrigationPaused);
        break;
      case "Resume Irrigation":
        new_SpecificCommands = this.commands.SystemSpecific.filter(_command => {
          if (_command.name != "Resume Irrigation" && _command.name != "Stop Irrigation") {
            return true;
          }
        });
        this.commands.SystemSpecific = new_SpecificCommands.concat(commandsWhilstIrrigating);
        break;
      case "Stop Irrigation":
        this.commands = this.managerService.fetchCommands(this.displayableSystem.system);
        break;
    }
    console.log("END OF CHANGE LIST COMMAND FUNCTION, CURRENT COMMANDS", this.commands)
  }
  // Command Execution
  private attemptExecuteCommand(command: SystemCommand_IF): boolean {
    if (command.name == "Test Single Zones") {
      let settings$: Observable<any> = this.settingsService.get_System_Settings(this.system)
      this.loader = this.loadingCtrl.create({
        content: "Fetching Zone Information..."
      });
      this.loader.present();
      settings$.subscribe(ShrikeSettings => {
        let temp: BushShrike_Settings_IF = ShrikeSettings as BushShrike_Settings_IF;
        this.zonesToTest = temp.BushShrikeSettings.zones;
        this.loader.dismiss();
        this.modalCtrl.create(ZoneTestingModal, { System: this.system, Zones: this.zonesToTest }).present();

      })
    }
    else {
      return this.managerService.attemptExecuteCommand(this.displayableSystem.system, command);
    }
  }

}
const commandsWhilstIrrigating: Array<SystemCommand_IF> = [
  {
    name: "Pause Irrigation",
    mqttMessage: "i"
  },
  {
    name: "Stop Irrigation",
    mqttMessage: "s"
  },
]
const commandsWhilstIrrigationPaused: Array<SystemCommand_IF> = [
  {
    name: "Resume Irrigation",
    mqttMessage: "i"
  },
  {
    name: "Stop Irrigation",
    mqttMessage: "s"
  },
]
