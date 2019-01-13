import { Injectable } from '@angular/core';
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
  AdminUser_IF,
  newClientUserObject
} from '../../interfaces/interfaces_all';
import { FIREBASE_PATHS } from './profiles-service.globals';


@Injectable()
export class ProfileServiceProvider {
  private userObjectReady = new BehaviorSubject(false);
  private admin_User_BS = new BehaviorSubject({} as AdminUser_IF);
  private client_User_BS = new BehaviorSubject({} as newClientUserObject);
  private adminUser$: Observable<AdminUser_IF>;
  private clientUser$: Observable<newClientUserObject>;
  private initialized: boolean = false;
  private initializedAs: string;
  constructor(public db: AngularFireDatabase) {
    console.log('Hello ProfileServiceProvider Provider');
  }
  // PUBLIC FUNCTIONS //
  public awaitUserObject_BS(){
    return this.userObjectReady;
  }
  public initializeAsAdmin(uid: string) {
    this.adminUser$ = this.db.object(FIREBASE_PATHS.TESTING_ADMINS + uid).valueChanges();
    this.adminUser$.subscribe(_adminUser => {
      console.log("WE HAVE AN ADMIN USER", _adminUser);
      this.admin_User_BS.next(_adminUser);
      this.initializedAs = "admin";
      this.initialized = true;
      this.userObjectReady.next(this.initialized);
    })
  }
  public initializeAsClient(uid: string) {
    this.clientUser$ = this.db.object(FIREBASE_PATHS.TESTING_CLIENTS + uid).valueChanges();
    this.clientUser$.subscribe(_clientUser => {
      console.log("WE HAVE AN Client USER", _clientUser);
      this.client_User_BS.next(_clientUser);
      this.initializedAs = "client";
      this.initialized = true;
      this.userObjectReady.next(this.initialized);
    })
  }

  // Retrieve Behaviour Subjects
  public getUserObject_BS() {
    if(this.initialized){
      console.log("INITIALIZED AS", this.initializedAs)
      switch(this.initializedAs){
        case 'admin':
          return this.admin_User_BS;
        case 'client':
          return this.client_User_BS;
        default:
          return Observable.create(null);
      }
    }
    else {
      return Observable.create(null);
    }
  }
}
