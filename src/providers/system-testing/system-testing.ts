import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { AngularFireDatabase } from "angularfire2/database";
import { ClientInterface } from '../../interfaces/client';
import { SystemInterface } from '../../interfaces/system';
import { IrrigationSettings } from '../../interfaces/irrigationSettings';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
@Injectable()
export class SystemTestingProvider {
  private settingsRef$;
  public testCategories: [string] = categories;
  public allTests: [SystemTest] = allTests;
  public testReady: boolean = false;
  public systems_To_Test: Array<SystemInterface>;
  constructor(
    public http: Http,
    private afDatabase: AngularFireDatabase,
    private alertCtrl: AlertController,
  ) {
    console.log('Hello SystemTestingProvider Provider');
  }
  set_Test_Ready() {
    this.testReady = true;
  }
  // Not done yet, only works for singular systems
  set_Test_Systems(system: SystemInterface) {
    this.systems_To_Test = [];
    this.systems_To_Test.push(system);
  }
  present_run_test_alert(test: string, system: SystemInterface) {
    console.log("Running test for " + system.system_model + ', GSID: ' + system.GSID);
    console.log('Test: ' + test);
    let alert = this.alertCtrl.create({
      title: 'Test Setup Complete!',
      message: 'We will now proceed to run test: ' + test + " for GSID: " + system.GSID,
      buttons: [{
        text: "Okay",
        handler: data => {
          this.set_Test_Systems(system);
          this.set_Test_Ready();
        }
      }]
    });
    alert.present();
  }
  present_Cannot_Run_Test_Alert() {
    let alert = this.alertCtrl.create({
      title: 'Cannot Run Test',
      message: 'Selected client does not have a system for which this test can be run.',
      buttons: ['OK']
    });
    alert.present();
  }
  restartTestingWizard() {
    if (this.testReady) {
      this.testReady = false;
    }
  }
  can_Run_Test(category: string, test: string, client: ClientInterface) {
    let temp = this;
    let canRun: boolean = false;
    let selectedSystem: SystemInterface;
    let clientSystems = client.systems;
    clientSystems.forEach((system, index) => {
      let url = 'systems/' + String(system);
      let ref$ = this.afDatabase.object(url).valueChanges();
      ref$.subscribe(data => {
        selectedSystem = data as SystemInterface;
        if ((category == "Rainwater" || category == "Greywater")
          && (selectedSystem.system_model == "GRCombo")) {
          canRun = true;
        }
        if (category == selectedSystem.system_model) {
          canRun = true;
        }
        if (canRun) {
          temp.present_run_test_alert(test, selectedSystem);
        }
        if (!canRun && (clientSystems.length == (index + 1))) {
          temp.present_Cannot_Run_Test_Alert();
        }
      })
    })
  }
  get_Tests_For_Category(category: string) {
    return this.filterByCategory(category);
  }
  filterByCategory(the_category: string) {
    let tests: Array<SystemTest> = [];
    let temp = this;
    for (let test of this.allTests) {
      test.categories.forEach(function(a_category) {
        if (a_category === the_category) {
          tests.push(test);
        }
      })
    }
    return tests;
  }
  /* Single Zone Testing
      Purpose: Run through each zone to determine that irrigation works correctly (Mode, time etc)
      Notes: Zone Order is not tested.
      Outcomes: Know that each zone runs for 1 minute and everything seems fine, therefore
      determine number of zones the system is using.
  */
  single_Zone_Test(system: SystemInterface) {
    console.log("Running Single Zone test function")
    let settings: IrrigationSettings;
    let settingsRef$: Observable<IrrigationSettings>
      = this.afDatabase.object('systems_settings/' + system.GSID + "/settings").valueChanges();
    settingsRef$.subscribe(settings => {
      console.log("Settings", settings);
    })
  }
}

let categories: [string] = [
  "Irrigation",
  "Greywater",
  "Rainwater",
  "GRCombo"
]
let allTests: [SystemTest] = [
  {
    name: "Single Zones",
    categories: ["Irrigation"]
  },
  {
    name: "Zone Coordination",
    categories: ["Irrigation"]
  },
  {
    name: "Timing",
    categories: ["Irrigation"]
  },
  {
    name: "External System Integration",
    categories: ["Irrigation"]
  },
  {
    name: "Scheduling",
    categories: ["Greywater", "Rainwater", "GRCombo"]
  },
  {
    name: "Rain Tank Levels",
    categories: ["Rainwater", "GRCombo"]
  },
  {
    name: "Grey Tank Levels",
    categories: ["Greywater", "GRCombo"]
  },
];

interface SystemTest {
  name: string;
  categories: [string];
}
interface test_Info {
  test: SystemTest;
  running: boolean;
  result: string;
  error: string;
}
