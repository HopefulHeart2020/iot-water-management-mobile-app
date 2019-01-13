import { System_IF, SystemCommand_IF } from '../../interfaces/interfaces_all';


export const Generic_Commands: Array<SystemCommand_IF> = [
  {
    name: "Enter Maintenance Mode",
    mqttMessage: "m"
  },
];

export const FishEagleCommands: Array<SystemCommand_IF> = [
  {
    name: "Circulate Greywater",
    mqttMessage: "g"
  },
  {
    name: "Drain Greywater",
    mqttMessage: "b"
  },
  {
    name: "Circulate Rainwater",
    mqttMessage: "r"
  },
  {
    name: "Drain Rainwater",
    mqttMessage: "b"
  },
  {
    name: "Filter Auto Clean",
    mqttMessage: "b"
  },
];
export const BushShrikeCommands: Array<SystemCommand_IF> = [
  {
    name: "Irrigate Now",
    mqttMessage: "i"
  },
  {
    name: "Test Single Zones",
    mqttMessage: "a"
  }
];
