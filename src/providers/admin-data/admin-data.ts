import { Injectable } from '@angular/core';
import { GC_Authentication } from '../authentication';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import { AngularFireDatabase } from "angularfire2/database";
import { Operator } from 'rxjs/Rx';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import {
  AdminProfile_IF,
  TechnicianProfile_IF,
  ClientProfile_IF,
  System_IF,
  UserRole_IF,
} from '../../interfaces/interfaces_all';
import { FIREBASE_PATHS } from './session-data.globals';

@Injectable()
export class AdminUserDataProvider {
  // Identity Objects
  private uid: string;
  private role = {} as UserRole_IF;
  // Variables to store data to be set into behaviour Subjects
  private admin_User: AdminUser_IF;
  private admin_User_BS = new BehaviorSubject({} as AdminUser_IF);
  private adminClients: Array<ClientProfile_IF>;
  private adminClientsReady: boolean = true;
  private adminClients_BS = new BehaviorSubject(Array<ClientProfile_IF>());
  // private Admin_clients_BS = new BehaviorSubject(Array<ClientProfile_IF>());
  // Behaviour Subjects for Instant Data Access
  private AdminProfile_BS = new BehaviorSubject({} as any);
  private role_BS = new BehaviorSubject({} as UserRole_IF);
  private clientSystems_BS = new BehaviorSubject(Array<System_IF>());
  // Observables
  private role$: Observable<UserRole_IF>;
  private profile$: Observable<any>;

  constructor(
    private db: AngularFireDatabase,
  ) {
  }

  /*
    PRIVATE FUNCTIONS
  */
  private initialize( adminUser: AdminUser_IF, role: UserRole_IF ){
    console.log("######### Initializing Admin Data #########");
    this.admin_User = adminUser;
    this.admin_User_BS.next(adminUser);
    this.retrieveAdminClients();
  }
  private retrieveAdminClients(){
    this.adminClients = [];
    this.admin_User.clients.forEach( (clientUID, index) => {
      let clientObject$: Observable<newClientUserObject>;
      clientObject$ = this.db.object('testing/users/clients/' + clientUID).valueChanges();
      clientObject$
      .subscribe( _userObject => {
        let profile: ClientProfile_IF = {} as ClientProfile_IF;
        profile.email = _userObject.email;
        let adminMember: newClientProfile = _userObject.profiles.find(_family_profile=>{
          return _family_profile.admin == true
        })
        profile.first_name = adminMember.first_name;
        profile.last_name = adminMember.last_name;
        profile.systems = _userObject.systems;
        this.adminClients.push(profile)
        if(this.adminClients.length == this.admin_User.clients.length){
          this.adminClientsReady = true;
          this.adminClients_BS.next(this.adminClients);
          console.log("ADMIN CLIENTS READY", this.adminClients)
        }
      });
    })
  }
  /*
    PUBLIC FUNCTIONS
  */
  public initialize_As_Admin(adminUser: AdminUser_IF, role: UserRole_IF){
    if(adminUser){
      this.initialize(adminUser, role);
    }else{
      throw new Error("No Admin User Provided for Admin Data Service")
    }
  }
  public get_AdminProfile_BS(){

  }
  public get_AdminClients_BS() {
    return this.adminClients_BS;
  }
  public getSystemObject(gsid){
    let systemObject$: Observable<System_IF>;
    systemObject$ = this.db.object("testing/systems/"+gsid).valueChanges();
    return systemObject$;
  }
  public getAdmin_User_BS() {
    return this.admin_User_BS;
  }
}
interface AdminUser_IF {
  admin_profile: AdminProfile;
  email: string;
  clients: Array<string>;

}
interface AdminProfile {
  first_name: string;
  last_name: string;
  username: string;
}
interface newClientUserObject {
  systems: Array<number>
  email: string;
  profiles: Array<newClientProfile>;
}
interface newClientProfile {
  first_name: string;
  last_name: string;
  admin: boolean;
  username: string;
}
