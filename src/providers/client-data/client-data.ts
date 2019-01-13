import { Injectable } from '@angular/core';
import { GC_Authentication } from '../authentication';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import { AngularFireDatabase } from "angularfire2/database";
import { Operator } from 'rxjs/Rx';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import {
  TechnicianProfile_IF,
  System_IF,
  UserRole_IF,
} from '../../interfaces/interfaces_all';
import {  ClientProfile_IF,
          AdminUser_IF,
          AdminProfile_IF,
          ClientUser_IF } from '../../interfaces/client.interfaces';
import { FIREBASE_PATHS } from './session-data.globals';

@Injectable()
export class ClientUserDataProvider {
  // Identity Objects
  private uid: string;
  private role = {} as UserRole_IF;
  // Variables to store data to be set into behaviour Subjects
  private clientUser: ClientUser_IF;
  private client_User_BS = new BehaviorSubject({} as ClientUser_IF);
  private selected_Profile_BS =new BehaviorSubject({} as ClientProfile_IF);
  private systemObjects_BS = new BehaviorSubject(Array<System_IF>());
  constructor(
    private db: AngularFireDatabase,
  ) {
  }

  /*
    PRIVATE FUNCTIONS
  */
  private initialize( _clientUser: ClientUser_IF, role: UserRole_IF ){
    console.log("######### Initializing Client Data #########", _clientUser);
    this.client_User_BS.next(_clientUser);
    let systems: Array<System_IF> = [];
    let system_gsids = _clientUser.systems;
    let number_systems = system_gsids.length;
    system_gsids.forEach((systemGSID, index) => {
      console.log("Need to fetch system for GSID ", systemGSID)
      let system$: Observable<System_IF>;
      system$ = this.db.object("/testing/systems/" + systemGSID).valueChanges();
      system$.take(1).subscribe( system => {
        console.log("Fetched system", system)
        systems.push(system);
        console.log("Systems Length 1 ", number_systems)
        console.log("Systems Length 2 ", systems.length)
        if(systems.length == number_systems){
          this.systemObjects_BS.next(systems);
          console.log("Annnd here are the systems..", systems)
        }
      })
    })
  }

  /*
    PUBLIC FUNCTIONS
  */
  public initialize_As_Client(_clientUser: ClientUser_IF, role: UserRole_IF){
    if(_clientUser){
      this.initialize(_clientUser, role);
    }else{
      throw new Error("No Admin User Provided for Admin Data Service")
    }
  }
  public getClient_User_BS(){
    return this.client_User_BS
  }
  public updateSelectedProfile(selectedProfile: ClientProfile_IF){
    this.selected_Profile_BS.next(selectedProfile);
  }
  public getSelectedProfile_BS(){
    return this.selected_Profile_BS;
  }
  public get_SystemObjects_BS(){
    return this.systemObjects_BS;
  }
}
