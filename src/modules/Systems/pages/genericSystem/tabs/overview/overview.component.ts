import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase } from "angularfire2/database";
import {
  System_IF,
  displayable_System_IF,
  System_OverviewArgs_IF,
} from '../../../../interfaces/interfaces_all';
import { FIREBASE_PATHS } from '../../../../utils/firebase.globals';
import { Observable } from 'rxjs/Rx';
@Component({
  selector: 'page-overview',
  templateUrl: 'overview.html',
})
export class SystemOverviewPage {
  private isReady: boolean = false;
  private sargs: System_OverviewArgs_IF;
  private displayableSystem: displayable_System_IF;
  private observable_Data$: Observable<any>;
  constructor(
    private db: AngularFireDatabase,
    public navCtrl: NavController,
    public navParams: NavParams,
  ) {
    this.initialize();

  }
  /*
  Lifecycle Hooks
  */
  private initialize() {
    this.sargs = this.navParams.data;
    this.displayableSystem = this.sargs.displayableSystem;
    this.isReady = true;
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad OverviewPage');
    console.log("SARGS IN OVERVIEW", this.sargs)
  }
  ngOnDestroy() {
  }
  /*
    Private Functions
  */

}
