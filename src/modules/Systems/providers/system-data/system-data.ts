import { Injectable } from '@angular/core';
import { GC_Authentication } from '../authentication';
import {
  AngularFireDatabase
} from "angularfire2/database";
import { Observable, Operator } from 'rxjs/Rx';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
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
import { GenericSystemObservable_IF,
         FishEagle_Obs_IF,
         BushShrike_Obs_IF,
         ObservableAxiom_IF
       } from './sd-observables.globals';
import { FIREBASE_PATHS } from '../../utils/firebase.globals';

@Injectable()
export class SystemDataProvider {
  private role: UserRole_IF;
  private profile: GenericProfile;
  private clientSystemsObjects: Array<System_IF>;
  private specificClientSystemsObjects: Array<System_IF>;
  private clientSystems_BS = new BehaviorSubject(Array<System_IF>());

  private system_Entities: Array<SETTINGS_IFP.systemEntity_IF>;
  private systems_Entity_BS = new BehaviorSubject(Array<SETTINGS_IFP.systemEntity_IF>());
  private system_Settings: Array<SETTINGS_IFP.settings_Axiom_IF>;
  private system_Settings_BS = new BehaviorSubject(Array<SETTINGS_IFP.settings_Axiom_IF>());
  private system_Obs: Array<ObservableAxiom_IF>;
  private system_Obs_BS = new BehaviorSubject(Array<ObservableAxiom_IF>());
  constructor(
    private sessionData: SessionDataProvider,
    private db: AngularFireDatabase,
  ) {
    console.log("######### Initializing System Data #########");
    this.initialize();
  }

  private initialize(client?: ClientProfile_IF) {
    this.getRole_profile_systems();
    this.retrieve_SystemsObservables();
  }
  private set_Behaviours_to_Null() {
    this.system_Settings_BS.next(null);
  }
  private getRole_profile_systems() {
    this.sessionData.get_Role_BS().subscribe(role => {
      this.role = role;
      this.getProfile_and_Systems();
    })
  }
  private getProfile_and_Systems(client?: ClientProfile_IF) {
    console.log("Getting profile and systems")
    if (this.role) {
      this.sessionData.get_Profile_BS().subscribe(_profile => {
        let systemObjects: Array<System_IF>;
        switch (this.role.roleCode) {
          case 0:
            let c_profile: ClientProfile_IF = _profile;
            systemObjects = c_profile.system_Objects;
            this.clientSystemsObjects = systemObjects;
            this.profile = _profile as GenericProfile;
            this.clientSystems_BS.next(systemObjects);
            break;
          case 1:
          case 2:
          case 3:
          case 4:
          case 5:
              // TODO: Handle other profile in a better way
            break;
        }
      })
    }
  }
  private fetch_System_Entity_Axioms(systems: Array<System_IF>) {
    console.log("Systems", systems)
    systems.forEach((system, index) => {
      let gsid = system.GSID;
      switch (system.system_model) {
        // Greywater Rainwater Combo
        case "Fish Eagle":
          //this.fetch_FishEagle_Entity(system);
          break;
        // Greywater
        case "Grey Heron":
          break;
        // Rainwater
        case "Rain Falcon":
          break;
        case "Bush Shrike":
          //this.fetch_BushShrike_Entity(system);
          break;
      }
    })
  }
  private fetch_Systems_Settings(systems: Array<System_IF>) {
    this.system_Settings = [];
    console.log("Systems", systems)
    systems.forEach((system, index) => {
      let gsid = system.GSID;
      switch (system.system_model) {
        // Greywater Rainwater Combo
        case "Fish Eagle":
          //this.fetch_FishEagle_Entity(system);
          break;
        // Greywater
        case "Grey Heron":
          break;
        // Rainwater
        case "Rain Falcon":
          break;
        case "Bush Shrike":
          this.retrieve_BushShrike_Settings(system);
          break;
      }
    })
  }
  private fetch_FishEagle_Entity(system: System_IF) {
    console.log("About to fetch Fish Eagle Axiom")
    let gsid: number = this.ensure_Numeric_GSID(system.GSID);
    let settings$: Observable<SETTINGS_IFP.FishEagle_Settings_IF>;
    settings$ = this.db.object(FIREBASE_PATHS.TESTING_SETTINGS + gsid).valueChanges();
  }

  private retrieve_BushShrike_Settings(system: System_IF) {
    if (system.system_model != "Bush Shrike") {
      console.log("Error: System is not a Bush Shrike.");
      return
    } else {
      let axiom: SETTINGS_IFP.settings_Axiom_IF = {} as SETTINGS_IFP.settings_Axiom_IF;
      let gsid: number = this.ensure_Numeric_GSID(system.GSID);
      axiom.GSID = gsid;
      let settings$: Observable<SETTINGS_IFP.BushShrike_Settings_IF>;
      let settingsAxiom: SETTINGS_IFP.settings_Axiom_IF;
      settings$ = this.db.object(FIREBASE_PATHS.TESTING_SETTINGS + gsid).valueChanges();
      settings$.map(_settings => {
        let settings = _settings as SETTINGS_IFP.BushShrike_Settings_IF;
        axiom.settings = settings;
        return axiom;
      }).subscribe(settingsAxiom => {
        let exists = this.system_Settings.filter(axiom => {
          if (axiom.GSID == settingsAxiom.GSID) {
            return axiom;
          }
        })
        if (exists.length == 1) {
          console.log("Settings Exists");
        } else {
          this.system_Settings.push(settingsAxiom)
        }
      })
    }
  }
  private fetch_BushShrike_Observables(system: System_IF) {
    // let observables$: FirebaseObjectObservable<any>;
    // observables$ = this.db.object(FIREBASE_PATHS.SYSTEM_OBSERVABLES + gsid);
    // observables$.map( observables => {
    //   entity.observables = observables;
    //   return observables;
    // })
  }
  ensure_Numeric_GSID(GSID: string | number): number {
    let gsid: number;
    if (typeof GSID == 'string') {
      gsid = parseInt(GSID);
    }
    else {
      gsid = GSID;
    }
    return gsid;
  }
  retrieve_SystemsObservables(client?: ClientProfile_IF) {
    this.system_Obs = [];
    if (this.role) {
      if (this.clientSystemsObjects) {
        this.clientSystemsObjects.forEach((system, index) => {
          let system_observables$: Observable<any>;
          system_observables$ = this.db.object(FIREBASE_PATHS.SYSTEM_OBSERVABLES + system.GSID).valueChanges();
          system_observables$.map(_systemObs => this.mapSystemObservables(system, _systemObs))
          .subscribe( _obsDataObj => {
            let index = this.obsAxiomExists(_obsDataObj)
            if(typeof index == 'number'){
              let i: number = index;
              this.system_Obs[i] = _obsDataObj;
            }else {
              // New Observable axiom?
              this.system_Obs.push(_obsDataObj);
            }
          });
          if( this.clientSystemsObjects.length == index + 1){
            this.system_Obs_BS.next(this.system_Obs);
          }
        })
      }
    }
  }
  private obsAxiomExists( obsDataObj: ObservableAxiom_IF ){
    let gsid = obsDataObj.system.GSID;
    this.system_Obs.forEach( (obsAxiom, index) => {
      if(obsAxiom.system === obsDataObj.system){
        return index;
      }
    })
    return false;
  }
  private mapSystemObservables(system: System_IF, systemObsData: any) {
    let observableDataObject: ObservableAxiom_IF = {} as ObservableAxiom_IF;
    observableDataObject.system = system;
    switch(system.system_model){
      case "Fish Eagle":
        observableDataObject.rtData = systemObsData as FishEagle_Obs_IF;
        break;
      case "Bush Shrike":
        observableDataObject.rtData = systemObsData as BushShrike_Obs_IF;
        break;
      default:
        observableDataObject.rtData = systemObsData as GenericSystemObservable_IF;
    }
    return observableDataObject;
  }
  private readyClient_System_Objects(client: ClientProfile_IF){
    if(this.role){
      console.log(this.role);
    }
  }
  /*
  PUBLIC FUNCTIONS
  */
  public get_Systems_Obs_BS(){
    return this.system_Obs_BS;
  }
  public get_System_State( GSID: number | string ): Observable<GenericSystemObservable_IF>{
    let path = FIREBASE_PATHS.SYSTEM_OBSERVABLES + GSID;
    let state$: Observable<GenericSystemObservable_IF>;
    state$ = this.db.object(path).valueChanges();
    return state$
  }
  public get_Specific_System_Observables( GSID: number | string ): Observable<any>{
    let path = FIREBASE_PATHS.SYSTEM_OBSERVABLES + GSID;
    let spec_Ob$: Observable<any>;
    spec_Ob$ = this.db.object(path).valueChanges();
    return spec_Ob$;
  }
  public get_Specific_System_Settings( GSID: number | string ): Observable <any>{
    let path = FIREBASE_PATHS.TESTING_SETTINGS + GSID;
    let spec_settings$: Observable<any>;
    spec_settings$ = this.db.object(path).valueChanges();
    return spec_settings$;
  }
  public get_Client_Systems_BS() {
    return this.clientSystems_BS;
  }
  public ready_Systems_Settings_BS() {
    this.system_Settings_BS.next(this.system_Settings);
  }
  public test() {
    this.ready_Systems_Settings_BS();
  }
  public get_Systems_Settings_BS() {
    return this.system_Settings_BS;
  }
  public get_Specific_Client_Systems(client: ClientProfile_IF): Array<System_IF> {
    this.readyClient_System_Objects(client);
    let systems: Array<System_IF> = [];
    return systems
  }
  ngOnDestroy() {

  }
}
