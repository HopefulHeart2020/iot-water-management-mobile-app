import { Component } from '@angular/core';
import {
  NavController, NavParams, ActionSheetController,
  LoadingController, ToastController, Platform
} from 'ionic-angular';
import { AngularFireDatabase } from "angularfire2/database";
import { SystemDataProvider } from "../../providers/system-data/system-data";
import { SessionDataProvider } from "../../../../providers/session-data/session-data";
import { BehaviorSubject } from 'rxjs/RX'
import {
  System_IF,
  ClientProfile_IF,
  displayable_System_IF,
  ObservableAxiom_IF,
  System_OverviewArgs_IF,
  UserRole_IF,
  gcSystemSubscription
} from "../../interfaces/interfaces_all";
// SYSTEM FLAVOURS //
import { GenericSystem } from '../genericSystem/genericSystem.component';
import { GC_MQTT_Service } from '../../providers/gc-mqtt/gc-mqtt.service';

@Component({
  selector: 'page-client-systemsRev',
  templateUrl: 'client_systemsRev.html',
})
export class ClientSystemsPageRevamped {
  private userRole: UserRole_IF;
  private profile: ClientProfile_IF;
  private profile_isReady: boolean = false;
  private thisClient: ClientProfile_IF;
  private canDisplaySystems: boolean = false;
  private adminToolboxEnabled: boolean = false;
  // Behaviour Subjects
  private systems: Array<System_IF>;
  private displayable_Systems: Array<displayable_System_IF>;
  private all_systems_Settings: any;
  private all_systems_Settings_BS$: BehaviorSubject<any>;
  private all_System_Observables: Array<ObservableAxiom_IF>;
  constructor(
    public  mqtt: GC_MQTT_Service,
    private platform: Platform,
    private loadingCtrl: LoadingController,
    private asCtrl: ActionSheetController,
    private systemsData: SystemDataProvider,
    private sessionData: SessionDataProvider,
    private navCtrl: NavController,
    private navParams: NavParams,
  ) {
    // this.mqtt.get_Broker_Online_BS().subscribe( brokerOnline => {
    //   console.log("Broker Online:", brokerOnline)
    //   if(brokerOnline && this.systems){
    //     console.log("Broker is online, subscribing to systems")
    //     this.mqtt.subscribe_To_Systems(this.systems);
    //     this.mqtt.get_System_Subscriptions_BS().subscribe( subscriptions => {
    //       console.log("Connected Systems, via MQTT:", subscriptions);
    //     })
    //   }
    // })
    if (this.navParams.get("client")) {
      this.initialize_As_Spec_Client(this.navParams.get("client"))
    } else if (this.navParams.get("clientRev")){
      this.initialize_Rev();
    }
    else{
      this.initialize();
    }

    //this.systemsData.get_Specific_Client_Systems()

  }
  ionViewDidLoad() {

  }
  ngOnDestroy() {
  }
  /*
  PRIVATE FUNCTIONS
  */
  private initialize_As_Spec_Client(client: ClientProfile_IF) {
    this.thisClient = client;
    console.log("This is an admin view of a specific client's Systems", this.thisClient)
    this.systems = this.thisClient.system_Objects;
    this.displayable_Systems = this.mapSystemsObjectsForDisplay(this.systems);
    this.canDisplaySystems = true;
    // this.sessionData.get_Role_BS().take(1).subscribe(role => {
    //   this.userRole = role;
    //   this.profile_isReady = true;
    //   if (this.userRole.role == "admin") {
    //     console.log("Toolbox enabled");
    //     this.adminToolboxEnabled = true;
    //   }
    // EntityLoader.dismiss();
    // })
  }
  private initialize_Rev(){
    let _client = this.navParams.get('clientRev');
    let systemObjects: Array<System_IF> = this.navParams.get('Systems');
    this.systems = systemObjects;
    let EntityLoader = this.loadingCtrl.create({
      content: "Fetching Systems2...",
    });
    EntityLoader.present();
    this.displayable_Systems = this.mapSystemsObjectsForDisplay(systemObjects);
    this.canDisplaySystems = true;
    EntityLoader.dismiss()
  }
  private initialize() {
    let EntityLoader = this.loadingCtrl.create({
      content: "Fetching Systems3...",
    });
    EntityLoader.present();
    this.systemsData.get_Client_Systems_BS().subscribe(_systems => {
      console.log("THE SYSTEMS", _systems)
      if (_systems) {
        let systemsObjects: Array<System_IF> = _systems;
        this.systems = systemsObjects;
        if (systemsObjects != null) {
          this.displayable_Systems = this.mapSystemsObjectsForDisplay(systemsObjects);
          this.canDisplaySystems = true;
          this.profile_isReady = true;
          EntityLoader.dismiss();
        }
      }
    })
    this.systemsData.get_Systems_Obs_BS().subscribe(_obs => {
      this.all_System_Observables = _obs;
      console.log("ALL SYSTEM OBSERVABLES ARRAY", this.all_System_Observables);
    })
  }
  private mapSystemsObjectsForDisplay(systemObjects: Array<System_IF>): Array<displayable_System_IF> {
    let displayableSystems: Array<displayable_System_IF> = [];
    systemObjects.forEach(system => {
      let ds: displayable_System_IF = {} as displayable_System_IF;
      ds.title = system.system_model;
      ds.system = system;
      switch (system.system_model) {
        case "Grey Heron":
          ds.subTitle = "Smart Greywater";
          ds.imgURL = "assets/img/Heron.png";
          break;
        case "Rain Raptor":
        case "Rain Falcon":
          ds.subTitle = "Smart Rainwater";
          ds.imgURL = "assets/img/Falcon.png";
          break;
        case "Fish Eagle":
          ds.subTitle = "Smart Water Premium";
          ds.imgURL = "assets/img/Falcon.png";
          break;
        case "Bush Shrike":
          ds.subTitle = "Smart Irrigation";
          ds.imgURL = "assets/img/Shrike.png";
      }
      displayableSystems.push(ds)
    });
    return displayableSystems;
  }
  private viewSystem(dsystem: displayable_System_IF) {
    let sargs = this.initialize_SystemArguments(dsystem);
    this.navCtrl.push(GenericSystem, { sargs: sargs })
  }
  private initialize_SystemArguments(displayableSystem: displayable_System_IF): System_OverviewArgs_IF {
    let sargs: System_OverviewArgs_IF = {} as System_OverviewArgs_IF;
    sargs.displayableSystem = displayableSystem;
    sargs.isExistingRT_Data = false;
    if (this.all_System_Observables) {
      let obsData: ObservableAxiom_IF = this.all_System_Observables.find(_obsObj => {
        if (_obsObj.system.GSID == sargs.displayableSystem.system.GSID) {
          return true;
        }
      });
      if (obsData) {
        sargs.isExistingRT_Data = true;
        sargs.existingRT_Data = obsData.rtData;
      }
    }
    return sargs;
  }
  private present_AdminOptions_AS(dispSystem: displayable_System_IF) {
    console.log("Chosen System", dispSystem);
    let optionsAS = this.asCtrl.create({
      title: 'Admin Options',
      subTitle: 'What would you like to do?',
      buttons: [
        {
          text: 'Troubleshoot',
          role: 'destructive',
          handler: () => {
            console.log('Troubleshoot clicked');
          }
        }, {
          text: 'View',
          handler: () => {
            this.viewSystem(dispSystem);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    optionsAS.present();
  }
}
