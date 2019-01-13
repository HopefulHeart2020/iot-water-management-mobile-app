import { System_IF } from './interfaces_all';
export interface AdminUser_IF {
  admin_profile: AdminProfile_IF;
  email: string;
  clients: Array<string>;

}
export interface AdminProfile_IF {
  first_name: string;
  last_name: string;
  username: string;
}
export interface ClientUser_IF {
  email: string;
  profiles: Array<ClientProfile_IF>;
  systems: Array<System_IF>;
}
export interface ClientProfile_IF {
  admin: boolean;
  first_name: string;
  last_name: string;
  username: string;
}
