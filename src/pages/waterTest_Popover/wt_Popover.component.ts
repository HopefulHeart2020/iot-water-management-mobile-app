import { Component } from '@angular/core';
import { NavParams, ToastController, ViewController } from 'ionic-angular';
import { SystemTest } from "../../interfaces/system_test";
import { SystemInterface } from "../../interfaces/system";
import { ClientInterface } from "../../interfaces/client";
import { SystemTestingProvider } from '../../providers/system-testing/system-testing';
@Component({
  selector: 'page-water-tests-pop',
  templateUrl: 'wt_Popover.html'
})
export class WaterTestPopover {
  private test: string;
  private client: ClientInterface;
  private systems: Array<SystemInterface>;
  private system_Iterator: number = 0;
  private all_Ready: boolean = false;
  private test_Feedback: testFeedback = {} as testFeedback;
  constructor(
    private testing: SystemTestingProvider,
    public viewCtrl: ViewController,
    public navParams: NavParams,
  )
  {
    this.test = this.navParams.get('test');
    this.client = this.navParams.get('client');
    this.systems = this.navParams.get('systems');
    if(this.test != undefined
      && this.client != undefined
      && this.systems != undefined){
      console.log("TESTING: All ready!");
      this.all_Ready = true;
      this.begin_Test();
    }
  }

  ionViewDidLoad() {
    console.log('test', this.test);
    console.log('client', this.client);
    console.log('systems', this.systems);
  }
  begin_Test(){
    switch(this.test){
      case "Single Zones":
        console.log("BEGINNING TEST!");
        this.testing.single_Zone_Test(this.systems[this.system_Iterator]);
        break;
      default:
        console.log("Not yet a valid test");
        break;
    }
  }
  close() {
    this.viewCtrl.dismiss();
  }
}
interface testFeedback {
  step: number;
  action: string;
  result: string;
  success: boolean;
}
