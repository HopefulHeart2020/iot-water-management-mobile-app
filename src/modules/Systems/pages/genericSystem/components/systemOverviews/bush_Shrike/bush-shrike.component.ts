import { Component, Input } from '@angular/core';
import { Observable, Operator, BehaviorSubject } from 'rxjs/Rx';
import {
  NavController, NavParams,
  Platform, LoadingController
} from 'ionic-angular';
import { AngularFireDatabase } from "angularfire2/database";
import { SystemArgumentsProvider } from '../../../../../providers/system-arguments/systemArguments.service';
import { SystemDataProvider } from '../../../../../providers/system-data/system-data';
import { GC_MQTT_Service } from '../../../../../providers/gc-mqtt/gc-mqtt.service';
import {
  System_IF,
  displayable_System_IF,
  ClientProfile_IF,
  GenericSystemObservable_IF,
  BushShrike_Obs_IF,
  System_OverviewArgs_IF,
} from "../../../../../interfaces/interfaces_all";

@Component({
  selector: 'bush-shrike-overview',
  templateUrl: 'bush-shrike.html'
})
export class BushShrikePage {
  private systemLinked: boolean = false;
  private systemLink$: BehaviorSubject<boolean>;
  private systemOnline: boolean;
  private systemStatus: string = "Awaiting System Response";
  private brokerConnection: boolean;

  private realTime_Data: BushShrike_Obs_IF = {} as BushShrike_Obs_IF;
  private displayableSystem: displayable_System_IF;
  private observableDataStream$: Observable<any>;
  private argumentsReady: boolean = false;
  private Sargs_BS: any;
  constructor(
            private mqtt: GC_MQTT_Service,
            private loadingCtrl: LoadingController,
            private sargsProvider: SystemArgumentsProvider,
            private systemData: SystemDataProvider
  ) {
    this.initialize();
  }
  ngOnDestroy(){

  }
  private initialize(){
    this.Sargs_BS = this.sargsProvider.get_SARGS_BS()
      .map( sargs => this.mapSARGS(sargs) )
      .switchMap( GSID => this.get_Live_Data_Stream(GSID))
      .subscribe();
  }
  private mapSARGS(_sargs){
    let sargs = _sargs as System_OverviewArgs_IF;
    this.displayableSystem = sargs.displayableSystem;
    if(sargs.isExistingRT_Data){
      this.map_rtData_Old(sargs.existingRT_Data);
    }

    //this.check_Connectivity();
    return sargs.displayableSystem.system.GSID;
  }
  private map_rtData_Old( existingRTData: GenericSystemObservable_IF ) {
    let temp =  {
      state: existingRTData.state,
    } as BushShrike_Obs_IF;
    this.realTime_Data = temp;
    console.log("UPDATES REALTIME DATA", this.realTime_Data)
  }
  private get_Live_Data_Stream(GSID){
      this.observableDataStream$ = this.systemData.get_Specific_System_Observables(GSID);
      return this.observableDataStream$.map( data => this.map_rtData_Old(data));
  }
  private getStatusButtonColour(){
    switch(this.systemStatus){
      case "Awaiting Ping":
        return 'orange';
      case "System Online":
        return "secondary";
      case "System Offline":
        return "danger";
    }
  }
  private showSystemInformation(){

  }
}
