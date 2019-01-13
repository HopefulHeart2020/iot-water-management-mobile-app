import { GeneralSettings } from '../interfaces/generalSettings';
/*
Roles
*/
export interface UserRole_IF{
  role: string;
  roleCode: number;
}
/*
users*/
export interface AdminUser_IF {
  admin_profile: AdminProfile;
  email: string;
  clients: Array<string>;

}
export interface AdminProfile {
  first_name: string;
  last_name: string;
  username: string;
}
export interface newClientUserObject {
  systems: Array<number>
  email: string;
  profiles: Array<newClientProfile>;
}
export interface newClientProfile {
  first_name: string;
  last_name: string;
  admin: boolean;
  username: string;
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
/*
  Observables Axiom
*/
export interface ObservableAxiom_IF {
  system: System_IF,
  rtData: any;
}
