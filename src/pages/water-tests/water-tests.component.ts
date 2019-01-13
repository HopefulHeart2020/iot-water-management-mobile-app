import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, PopoverController } from 'ionic-angular';
import { SystemTestingProvider } from '../../providers/system-testing/system-testing';
import { SystemTest } from '../../interfaces'
import { SystemInterface } from '../../interfaces/system';
import { ClientInterface } from '../../interfaces/client';
import { WaterTestPopover } from '../../pages/waterTest_Popover/wt_Popover.component';

@Component({
  selector: 'page-water-tests',
  templateUrl: 'water-tests.html',
})
export class WaterTestsPage {
  private step: string = "one";
  // Selection Variabled from Which to Process test/tests
  private selectedCategory: string;
  private selectedTest: string;
  private selectedClient: ClientInterface;
  // Tests
  private tests: Array<SystemTest>;
  private testable_systems: Array<SystemInterface>;
  constructor(
    private testing: SystemTestingProvider,
    public navCtrl: NavController,
    public navParams: NavParams,
    public toast: ToastController,
  ) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WaterTestsPage');
  }

  // Step One //
  selectCategory(category: string) {
    this.tests = this.testing.get_Tests_For_Category(category);
    this.selectedCategory = category;
  }
  // Step Two //
  selectTest(test_name: string) {
    this.selectedTest = test_name;
  }
  // Step Three //
  selectClient(client: ClientInterface) {
    this.selectedClient = client;
  }
  present_WaterTestPopover() {
   let popover = this.navCtrl.push(WaterTestPopover, {
     test: this.selectedTest,
     client: this.selectedClient,
     systems: this.testing.systems_To_Test
   });
 }
  getCategoryColor(category: string) {
    if (category == this.selectedCategory) {
      return "dark";
    } else {
      return "primary";
    }
  }
  nextStep() {

    let nextStep: string;
    switch (this.step) {
      case "one":
        nextStep = "two";
        break;
      case "two":
        nextStep = "three";
        break;
      case "three":
        this.verify_Selections();
        return;
      default:
        return;
    }
    this.step = nextStep;
  }
  prevStep() {
    let nextStep: string;
    switch (this.step) {
      case "one":
        return;
      case "two":
        nextStep = "one";
        break;
      case "three":
        nextStep = "two";
        break;
      default:
        return;
    }
    this.step = nextStep;
  }
  restartWizard() {
    this.selectedTest = null;
    this.selectedClient = null;
    this.selectedCategory = null;
    this.testing.restartTestingWizard();
    this.step = 'one';
  }
  can_Continue() {

  }
  verify_Selections() {
    if (this.selectedCategory != undefined
      && this.selectedTest != undefined
      && this.selectedClient != undefined) {
      this.testing.can_Run_Test(this.selectedCategory, this.selectedTest, this.selectedClient);
      this.step = null;
    }
    else {
      this.present_Verification_Error_Alert();
    }
  }

  present_Verification_Error_Alert() {
    let toast = this.toast.create({
      message: 'Please make a choice in all three steps!',
      duration: 2500,
      position: 'bottom'
    });
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
    toast.present();
  }
  goBack() {
    this.navCtrl.pop();
  }
}
interface SystemTest {
  name: string;
  categories: [string];
}
