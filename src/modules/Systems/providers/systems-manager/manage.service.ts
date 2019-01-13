import { Injectable } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {
  System_IF,
  SystemCommand_IF,
  SystemCommandsAll_IF
} from '../../interfaces/interfaces_all';
import {
  Generic_Commands,
  FishEagleCommands,
  BushShrikeCommands

} from './commands.globals';
import { GC_MQTT_Service } from '../gc-mqtt/gc-mqtt.service';
@Injectable()
export class ManagerCommandService {
  private isReady: boolean = false;
  private system: System_IF;
  constructor(
    private mqtt: GC_MQTT_Service
  ) {

  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad OverviewPage');
  }
  private get_CommandList(system: System_IF): SystemCommandsAll_IF {
    let commands = {} as SystemCommandsAll_IF;
    let genericCommands: Array<SystemCommand_IF> = Generic_Commands;
    let specCommands: Array<SystemCommand_IF>;
    switch (system.system_model) {
      case "Fish Eagle":
        specCommands = FishEagleCommands;
        break;
      case "Bush Shrike":
        specCommands = BushShrikeCommands;
        break;
      default:
        break;
    }
    commands.Generic = genericCommands;
    commands.SystemSpecific = specCommands;
    return commands;
  }
  // COMAND CHECKING //
  private checkForValidCommand(system_model: string, command: SystemCommand_IF): boolean {
    let isValid: boolean = false;
    if(system_model == "Bush Shrike" &&
    (command.name == "Pause Irrigation")||(command.name == "Resume Irrigation")){
      isValid = true;
    }else if (system_model == "Fish Eagle" && command.mqttMessage == "s"){
      isValid = true;
    }
    let a = Generic_Commands
      .filter(aCommand => this.checkForNameAgainstListObject(aCommand.name, command.name))
    let b;
    switch (system_model) {
      case "Fish Eagle":
        b = FishEagleCommands
          .filter(aCommand => this.checkForNameAgainstListObject(aCommand.name, command.name))
        break;
      case "Bush Shrike":
        b = BushShrikeCommands
          .filter(aCommand => this.checkForNameAgainstListObject(aCommand.name, command.name))
        break;
    }
    if (a || b) {
      isValid = true;
    }
    return isValid
  }
  private checkForNameAgainstListObject(aCommand_name: string, theCommand_name) {
    let isInThere: boolean = false;
    if (aCommand_name == theCommand_name) {
      isInThere = true;
    }
    return isInThere
  }
  // SPECIFIC COMMAND FUNCTIONS //
  private enterMaintenanceMode(gsid: string, mqttMessage: string): boolean {
    let success: boolean = false;

    return success
  }
  // PUBLIC FUNCTION //
  public fetchCommands(system: System_IF) {
    return this.get_CommandList(system);
  }
  public attemptExecuteCommand(system: System_IF, command: SystemCommand_IF): boolean {
    let success: boolean = false;
    let valid = this.checkForValidCommand(system.system_model, command);
    if (valid) {
      let gsid: string = system.GSID;
      let message;
      let topic =  gsid + "/C";
      switch (command.name) {
        case "Enter Maintenance Mode":
          success = this.enterMaintenanceMode(gsid, command.mqttMessage)
          break;
        case "Irrigate Now":
          console.log("This is where we need to Irrigate")
          message = "i";
          this.mqtt.sendMessage(message, topic);
          success = true;
          break;
        case "Pause Irrigation":
          console.log("This is where we need to Irrigate")
          message = "i";
          this.mqtt.sendMessage(message, topic);
          success = true;
          break;
        case "Resume Irrigation":
          console.log("This is where we need to Irrigate")
          message = "i";
          this.mqtt.sendMessage(message, topic);
          success = true;
          break;
        case "Stop Irrigation":
          console.log("This is where we need to Irrigate")
          message = "s";
          this.mqtt.sendMessage(message, topic);
          success = true;
          break;
        case "Circulate Greywater":
          console.log("This is where we need to Irrigate")
          message = "g";
          this.mqtt.sendMessage(message, topic);
          success = true;
          break;
        case "Drain Greywater":
          console.log("This is where we need to Irrigate")
          message = "g";
          this.mqtt.sendMessage(message, topic);
          success = true;
          break;
        case "Circulate Rainwater":
          console.log("This is where we need to Irrigate")
          message = "r";
          this.mqtt.sendMessage(message, topic);
          success = true;
          break;
        case "Drain Rainwater":
          console.log("This is where we need to Irrigate")
          message = "x";
          this.mqtt.sendMessage(message, topic);
          success = true;
          break;
        case "Filter Auto Clean":
          console.log("This is where we need to Irrigate")
          message = "b";
          this.mqtt.sendMessage(message, topic);
          success = true;
          break;
        default:
          if(command.mqttMessage == "s"){
            this.mqtt.sendMessage(command.mqttMessage, topic);
            success = true;
          }
          break;
      }
    }
    return success
  }
}
