export const FIREBASE_PATHS = {
  USERS:    "users/",
  SYSTEMS:  "systems/",
  SYSTEM_SETTINGS: "systems_settings/",
  SYSTEM_OBSERVABLES: "systems_observables/",
  SCHEDULE_SETTINGS: "systems_scheduler/",
  TESTING_SETTINGS: "testing/systems_settings/"
}

/* INTERFACES
GENERAL
*/
export interface System_IF {
  GSID: string;
  active: boolean;
  system_model: string;
}
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

export interface BushShrike_Settings_IF {
  mode_minutes: minutesPerMode_IF;
  zones: Array<SingleZoneSettings_IF>;
  use_municipal?: boolean;
}
/*
Arbitrary Interfaces and Enums
*/
export interface tankDimensions_IF {
  heightFull: number;
  sensorHeight: number;
}
export interface minutesPerMode_IF {
  E: number;
  S: number;
  M: number;
}
export interface SingleZoneSettings_IF {
  enabled: boolean;
  mode: string;
  name: string;
  time_minutes?: number;
  time_not_mode: boolean;
}

// SYSTEM AXIOMS //
export interface systemEntity_IF {
  system: System_IF;
  settings: any;
  observables?: any;
  history?: any;
}
export interface settings_Axiom_IF {
  GSID: number;
  settings: any;
}
