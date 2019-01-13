import { Component, Input } from '@angular/core';
import { Observable, Operator } from 'rxjs/Rx';
import {
  NavController, NavParams,
  Platform, LoadingController
} from 'ionic-angular';
import { AngularFireDatabase } from "angularfire2/database";
import { SystemArgumentsProvider } from '../../../../../providers/system-arguments/systemArguments.service';
import { SystemDataProvider } from '../../../../../providers/system-data/system-data';
import {
  System_IF,
  displayable_System_IF,
  ClientProfile_IF,
  FishEagle_Obs_IF,
  GreyHeron_Obs_IF,
  RainRaptor_Obs_IF,
  RainFalcon_Obs_IF,
  System_OverviewArgs_IF,
  tankObservables
} from "../../../../../interfaces/interfaces_all";
import { TankbarComponent } from '../../../../../components/tankBar/tankbar.component';
@Component({
  selector: 'fish-eagle-overview',
  templateUrl: 'fish-Eagle.html'
})
export class FishEaglePage {
  private errorsExist: boolean = false;
  private realTime_Data: FishEagle_Obs_IF = {} as FishEagle_Obs_IF;
  private displayableSystem: displayable_System_IF;
  private observableDataStream$: Observable<any>;
  private argumentsReady: boolean = false;
  private Sargs_BS: any;
  constructor(private loadingCtrl: LoadingController,
              private sargsProvider: SystemArgumentsProvider,
              private systemData: SystemDataProvider
    ) {
      this.initialize();
  }
  ngOnDestroy(){
    console.log("THE EAGLE HAS BEEN MURDERED");

  }
  private initialize(){
    this.Sargs_BS = this.sargsProvider.get_SARGS_BS()
      .map( sargs => this.mapSARGS(sargs) )
      .switchMap( GSID => this.get_Live_Data_Stream(GSID) )
      .subscribe();
  }
  private mapSARGS(_sargs){
    let sargs = _sargs as System_OverviewArgs_IF;
    this.displayableSystem = sargs.displayableSystem;
    if(sargs.isExistingRT_Data){
      this.map_rtData_Old(sargs.existingRT_Data);
    }
    return sargs.displayableSystem.system.GSID;
  }
  private map_rtData_Old(existingRTData: tempRTData) {
    let errors: Array<any> = [];
    if(existingRTData.errors){
      existingRTData.errors.forEach(error => {
        if(error == "BF"){
          errors.push("Biofilter Floatswitch Fault")
        }
      })
      this.errorsExist = true;
    }
    let temp =  {
      errors: errors,
      state: existingRTData.state,
      GreyHeronObservables: {
        tanks: {
          percentage: existingRTData.gPercentage,
          volume:     existingRTData.gVolume
        }
      },
      RainFalconObservables: {
        tanks: {
          percentage: existingRTData.rPercentage,
          volume:     existingRTData.rVolume
        }
      }
    } as FishEagle_Obs_IF;
    this.realTime_Data = temp;
    console.log("UPDATES REALTIME DATA", this.realTime_Data)
  }
  private get_Live_Data_Stream(GSID){
      this.observableDataStream$ = this.systemData.get_Specific_System_Observables(GSID);
      return this.observableDataStream$.map( data => this.map_rtData_Old(data));
  }
}
interface tempRTData {
  gPercentage: number;
  gVolume: number;
  rPercentage: number;
  rVolume: number;
  state: string;
  errors: Array<string>;
}
