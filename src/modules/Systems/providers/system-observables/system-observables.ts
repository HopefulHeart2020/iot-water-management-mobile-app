import { Injectable } from '@angular/core';
import { GC_Authentication } from '../authentication';
import {
  AngularFireDatabase
} from "angularfire2/database";
import { Observable, BehaviorSubject, Subject, Operator } from 'rxjs/Rx';
import { SessionDataProvider } from '../../../../providers/session-data/session-data';
import {
  GenericProfile,
  AdminProfile_IF,
  TechnicianProfile_IF,
  ClientProfile_IF,
  System_IF,
  UserRole_IF
} from '../../interfaces/interfaces_all';
import * as SETTINGS_IFP from './system-data.globals';
import { FIREBASE_PATHS } from '../../utils/firebase.globals';

@Injectable()
export class System_ObservableProvider {
  private clientSystems: Array<System_IF>;
  constructor(
    private db: AngularFireDatabase,
    private sessionData: SessionDataProvider
  ) {
    this.initialize();
  }
  private initialize(){
    console.log("######### Initializing System Observables #########");
    this.getClientSystems_observables();
  }
  private set_Behaviours_to_Null(){
  }
  private getClientSystems_observables(){

  }
  ngOnDestroy(){

  }
}
