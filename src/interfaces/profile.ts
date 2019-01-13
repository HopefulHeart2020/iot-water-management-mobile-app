import { GeneralSettings } from '../interfaces/generalSettings';
export interface Profile {
  uid: string;
  email: string;
  user_name: string;
  first_name: string;
  last_name: string;
  systems: any;
  general_settings: GeneralSettings;
  role?: string;
}
