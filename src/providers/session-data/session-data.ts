import { Injectable } from '@angular/core';
import { GC_Authentication } from '../authentication';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import {
  AngularFireDatabase
} from "angularfire2/database";
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
export class SessionDataProvider {
  // Identity Objects
  private uid: string;
  private role = {} as UserRole_IF;
  // Variables to store data to be set into behaviour Subjects
  private profile_Obj: any = {} as any;
  // Behaviour Subjects for Instant Data Access
  private profile_BS = new BehaviorSubject({} as any);
  private role_BS = new BehaviorSubject({} as UserRole_IF);
  private clientSystems_BS = new BehaviorSubject(Array<System_IF>());
  // Observables
  private role$: Observable<UserRole_IF>;
  private profile$: Observable<any>;

  constructor(
    private db: AngularFireDatabase,
    private auth: GC_Authentication
  ) {
    console.log("######### Initializing Session Data #########");
    this.initialize();
  }

  /*
    PRIVATE FUNCTIONS
  */
  private initialize() {
    this.set_UID();
    this.behaviours_To_Null();
    this.set_Observable_Paths();
    this.get_Role_and_Profile();
  }
  private set_UID() {
    this.uid = this.auth.get_uid();
  }
  private behaviours_To_Null() {
    this.clientSystems_BS.next(null);
    this.profile_BS.next(null);
    this.role_BS.next(null);
  }
  private set_Observable_Paths() {
    if (this.uid) {
      this.profile$ = this.db.object(FIREBASE_PATHS.USERS + this.uid).valueChanges();
    }
  }
  private get_Role_and_Profile() {
    let self = this;
    if (this.uid) {
      this.role$ = this.db.object('users_roles/' + this.uid).valueChanges();
      this.role$.switchMap(_role => {
        let role = _role as UserRole_IF;
        this.role = role;
        this.role_BS.next(role);
        console.log("THis.role", this.role)
        if (this.role.role == undefined || this.role.roleCode == undefined) {
          throw new Error('Something is wrong with the user role object');
        }
        return self.retrieve_Profile(role);
      })
        .subscribe();
    }
  }
  private retrieve_Profile(roleObject: UserRole_IF) {
    console.log("Inside retrieve profile");
    let self = this;
    return self.profile$
      .map(_profile => {
        self.map_Profile(_profile, roleObject);
      })
  }

  private map_Profile(_profile, role: UserRole_IF) {
    switch (role.roleCode) {
      case 0:
        this.map_Profile_as_Client(_profile);
        break;
      case 1:
      case 2:
      case 3:
        this.map_Profile_as_Technician(_profile);
        break;
      case 4:
      case 5:
        this.map_Profile_as_Admin(_profile);
        break;
      default:
        throw new Error("Failing to map to a profile class based on user role")
    }
  }
  private map_Profile_as_Client(_profile) {
    let profile = _profile as ClientProfile_IF;
    profile.system_Objects = [];
    let systems = profile.systems;
    let system_Object$: Observable<System_IF>;
    systems.forEach((systemGSID, index) => {
      system_Object$ = this.db.object(FIREBASE_PATHS.TESTING_SYSTEMS + systemGSID).valueChanges();
      system_Object$.subscribe(_systemObject => {
        profile.system_Objects.push(_systemObject);
      });
      // Indexing starts at zero
      if (systems.length == (index + 1)) {
        this.profile_Obj = profile;
        this.profile_BS.next(this.profile_Obj);
      }
    });
  }


  private map_Profile_as_Technician(_profile) {
    let profile = _profile as TechnicianProfile_IF;
  }
  private map_Profile_as_Admin(_profile) {
    let profile = _profile as AdminProfile_IF;
    console.log("Mapping Profile for Admin, Profile:", profile);
    let clients = profile.clients;
    profile.client_Objects = [];
    clients.forEach((UID, index) => {
      let client_Object$: Observable<ClientProfile_IF>;
      client_Object$ = this.db.object(FIREBASE_PATHS.USERS + UID).valueChanges();
      client_Object$.switchMap(clientObject => {
        let updatedClientObject: ClientProfile_IF = clientObject as ClientProfile_IF;
        let systems = updatedClientObject.systems;
        updatedClientObject.system_Objects = [];
        let system_Object$: Observable<System_IF>;
        systems.forEach((systemGSID, index) => {
          system_Object$ = this.db.object(FIREBASE_PATHS.TESTING_SYSTEMS + systemGSID).valueChanges();
          system_Object$.subscribe(_systemObject => {
            updatedClientObject.system_Objects.push(_systemObject);
          })
        })
        return Observable.of(updatedClientObject);
      })
        .map(_updatedClientObject => {
          if (!this.isEmptyObject(this.profile_Obj)) {
            let exists = this.check_if_Existing_Client(_updatedClientObject);
            if (exists) {
              profile.client_Objects[exists] = _updatedClientObject;
            }
          } else {
            profile.client_Objects.push(_updatedClientObject);
          }
          if (profile.clients.length == profile.client_Objects.length) {
            this.profile_Obj = profile;
            this.profile_BS.next(this.profile_Obj);
          }
        })
        .subscribe();
    })
  }
  private check_if_Existing_Client(_updatedClientObject: ClientProfile_IF) {
    let isExisting: any = false;
    let index: number = 0;
    let profile = this.profile_Obj as AdminProfile_IF;
    for (let clientObj of profile.client_Objects) {
      if ((clientObj.email == _updatedClientObject.email) &&
        (clientObj.user_name == _updatedClientObject.user_name)) {
        isExisting = index;
      }
      index++;
    }
    return isExisting;
  }
  /*
    PUBLIC FUNCTIONS
  */
  public get_Profile_BS() {
    return this.profile_BS;
  }
  public get_Role_BS() {
    return this.role_BS;
  }
  public get_Client_Systems_BS(){
    return this.clientSystems_BS;
  }
  public ready_ClientSystems_BS() {
    let success: boolean = false;
    if ( !this.profile_Obj ) {
      throw new Error("Cannot get profile object from SessionDataProvider");
    }
    else {
      let systems: Array<System_IF>;
      let profile = this.profile_Obj as ClientProfile_IF;
      systems = profile.system_Objects;
      if(!systems){
        this.clientSystems_BS.next(null);
      }else{
        success = true;
        this.clientSystems_BS.next(systems)
      }
    }
    return success;
  }
  /*
    RANDOM FUNCTIONS
  */
  private isEmptyObject(obj) {
    var name;
    for (name in obj) {
      return false;
    }
    return true;
  }
}
