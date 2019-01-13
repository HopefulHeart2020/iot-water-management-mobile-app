import { Injectable } from '@angular/core';
import {
  AngularFireDatabase
} from "angularfire2/database";
import { System_OverviewArgs_IF } from "../../interfaces/interfaces_all";
import {  BehaviorSubject } from 'rxjs/BehaviorSubject';
import { FIREBASE_PATHS } from '../../utils/firebase.globals';

@Injectable()
export class SystemArgumentsProvider {
  private SystemObservableData_BS = new BehaviorSubject({} as System_OverviewArgs_IF);
  constructor(
  ) {
    this.SystemObservableData_BS.next(null);
  }
  public update_Sargs(data){
    this.SystemObservableData_BS.next(data as System_OverviewArgs_IF);
  }
  public get_SARGS_BS(){
    return this.SystemObservableData_BS;
  }
}
