/*
Roles
*/
export interface UserRole_IF{
  role: string;
  roleCode: number;
}
/*
  Profiles
*/
export interface GenericProfile {
  uid: string;
  role: string;
  email: string;
  user_name: string;
  first_name: string;
  last_name: string;
}
export interface AdminProfile_IF extends GenericProfile {
  uid: string;
  role: string;
  email: string;
  user_name: string;
  first_name: string;
  last_name: string;
  clients: Array<string>;
  client_Objects: Array<ClientProfile_IF>;
  general_settings: MainSettingsAdmin_IF;
}
export interface TechnicianProfile_IF extends GenericProfile {
  uid: string;
  role: string;
  email: string;
  user_name: string;
  first_name: string;
  last_name: string;
  clients: Array<string>;
  client_Objects: Array<ClientProfile_IF>;
  general_settings: MainSettingsTechnician_IF;
}
export interface ClientProfile_IF extends GenericProfile {
  uid: string;
  role: string;
  email: string;
  user_name: string;
  first_name: string;
  last_name: string;
  systems: Array<number>;
  system_Objects?: Array<System_IF>;
  general_settings: MainSettingsClient_IF;
}
/*
  General Settings
*/
export interface MainSettingsAdmin_IF {
  troubleshooting?: boolean;
}
export interface MainSettingsTechnician_IF {
  troubleshooting?: boolean;
}
export interface MainSettingsClient_IF {
  familySharing: boolean;
  familyName: string;
}
/*
  Systems
*/
export interface System_IF {
  GSID: string;
  active: boolean;
  system_model: string;
}
export interface displayable_System_IF {
  system: System_IF;
  title: string;
  subTitle: string;
  imgURL: string;
}
export interface SystemCommand_IF {
  name: string;
  mqttMessage: string;
}
export interface SystemCommandsAll_IF {
  Generic: Array<SystemCommand_IF>;
  SystemSpecific: Array<SystemCommand_IF>;
}
// Observables
export interface ObservableAxiom_IF {
  system: System_IF;
  rtData: any;
}
/*
Observables
*/
/*
Generic System Observable
*/
export interface GenericSystemObservable_IF {
  state?: string;
  errors?: Array<string>;
}
/*
Grey Heron Observables
*/
export interface GreyHeron_Obs_IF extends GenericSystemObservable_IF {
  tanks: tankObservables;
}
/*
Rain Raptor Observables
*/
export interface RainRaptor_Obs_IF extends GenericSystemObservable_IF {
  tanks: tankObservables;
}
/*
Rain Falcon Observables
*/
export interface RainFalcon_Obs_IF extends GenericSystemObservable_IF {
  tanks: tankObservables;
  MunicipalObservables?: any;
}
/*
Fish Eagle Observables
*/
export interface FishEagle_Obs_IF extends GenericSystemObservable_IF {
  RainFalconObservables: RainFalcon_Obs_IF;
  GreyHeronObservables: GreyHeron_Obs_IF;
}
/*
Bush Shrike Observables
*/
export interface BushShrike_Obs_IF extends GenericSystemObservable_IF {
  last_irrigation?: string;
}
/*
  SYSTEM SETTINGS
*/
/*
Generic System Settings
*/
export interface Generic_SystemSettings_IF {
  defaults_enabled: boolean;
}
/*
Grey Heron System Settings
*/
export interface GreyHeron_Settings_IF extends Generic_SystemSettings_IF {
  gTankType?: string;
  gTankProductCode?: number;
  gTanks: number;
  tank_dimensions?: tankDimensions_IF;
}
/*
Rain Raptor System Settings
*/
export interface RainRaptor_Settings_IF extends Generic_SystemSettings_IF {
  rTankType?: string;
  rTankProductCode?: number;
  rTanks: number;
  tank_dimensions?: tankDimensions_IF;
}
/*
Rain Falcon System Settings
*/
export interface RainFalcon_Settings_IF extends RainRaptor_Settings_IF {
  // Other rain to home settings
  rainToHome?: boolean;
}
/*
Fish Eagle System Settings
*/
export interface FishEagle_Settings_IF {
  GreyHeronSettings:  GreyHeron_Settings_IF;
  RainFalconSettings: RainFalcon_Settings_IF;
}
/*
Bush Shrike Settings
*/

export interface Shrike_Settings_IF {
  mode_minutes: minutesPerMode_IF;
  zones: Array<SingleZoneSettings_IF>;
  use_municipal?: boolean;
  sources: WaterSources;
}
export interface BushShrike_Settings_IF {
  BushShrikeSettings: Shrike_Settings_IF;
}
export interface WaterSources {
  source: string;
}
/*
Arbitrary Interfaces and Enums
*/

export interface tankDimensions_IF {
  heightFull: number;
  sensorHeight: number;
  capacity?: number;
}
export interface minutesPerMode_IF {
  E: number;
  S: number;
  M: number;
}
export interface SingleZoneSettings_IF {
  enabled: boolean;
  id: string;
  mode: string;
  name: string;
  time_minutes?: number;
  time_not_mode: boolean;
}

export interface SystemInterface {
  GSID: string;
  active: boolean,
  system_model: string,
  user_id?: string,
}

export interface settingsOption {
  name: string;
  icon: string;
}
/*
  Scheduling
*/
export interface Schedule_IF {
  name?: string;
  type: string;
  mqttCommand: string;
  days: Array< any >;
  hour: number;
  minutes: number;
  code?: string;
}
/*
Component Communication Via Decorators
*/
export interface System_OverviewArgs_IF {
  displayableSystem: displayable_System_IF;
  isExistingRT_Data: boolean;
  existingRT_Data?: any;
}
/*
ARBITRARY INTERFACES
*/
export interface tankObservables {
  volume: number;
  percentage: number;
}
export interface gcSystemSubscription {
  system: System_IF;
  awaitingPing?: boolean;
}
