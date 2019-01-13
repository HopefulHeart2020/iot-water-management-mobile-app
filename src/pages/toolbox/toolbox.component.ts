import { Component } from '@angular/core';
import {
  NavController, NavParams, ToastController, AlertController,
  ViewController, ActionSheetController, LoadingController
} from 'ionic-angular';
import { AngularFireAuth } from "angularfire2/auth";
import { AngularFireDatabase  } from "angularfire2/database";
import { Observable } from 'rxjs/Observable';
import { Profile } from "../../interfaces/profile";
import { ChainWeather } from "../../providers/weather2";
import { Day_Forecast } from "../../interfaces/day_forecast";
import { WaterTestsPage } from "../../pages/water-tests/water-tests.component";

@Component({
  selector: 'page-toolbox',
  templateUrl: 'toolbox.html'
})
export class ToolboxPage {
  private toolboxOpen: boolean = true;
  private content_class = "toolbox";
  private observable;
  constructor(
    public viewCtrl: ViewController,
    public afDatabase: AngularFireDatabase,
    public alertCtrl: AlertController,
    public weather: ChainWeather,
    public loading: LoadingController,
    public navCtrl: NavController,
    public navParams: NavParams)
    {

  }


  close() {
    this.viewCtrl.dismiss();
  }
  openToolbox(){
    console.log("Toolbox Opened");
    this.content_class = "toolbox";
    this.toolboxOpen = true;
  }
  open_WaterTests(){
    this.navCtrl.push(WaterTestsPage);
  }
  open_ComsTests(){

  }
  open_OtherTests(){

  }
}
