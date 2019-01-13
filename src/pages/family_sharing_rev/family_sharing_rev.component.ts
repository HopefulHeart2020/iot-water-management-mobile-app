import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { AngularFireAuth } from "angularfire2/auth";
import { AngularFireDatabase } from "angularfire2/database";
import { Profile } from "../../interfaces/profile";
import { ChainWeather } from "../../providers/weather2";
import { GRCombo } from '../../modules/GC_Core/components/system/flavours/grCombo/gr.component';
import { IrrigationSystem } from '../../modules/GC_Core/components/system/flavours/irrigation/irrigation.component';
import { GeneralProvider } from '../../providers/general';
import { ClientInterface } from "../../interfaces/client";
import { FamilyMember } from "../../interfaces/family_member";
import { Observable } from 'rxjs/Observable';
import { GC_Authentication } from '../../providers/authentication';
import { ClientUserDataProvider } from '../../providers/client-data/client-data';
import { ClientUser_IF,
         ClientProfile_IF } from '../../interfaces/client.interfaces';
import { ClientDashboardPage } from '../../pages/clientDashboard/clientDashboard.component';
@Component({
  selector: 'page-family-sharing-rev',
  templateUrl: 'family_sharing_rev.html'
})
export class FamilySharingRevamped {
  private clientUser: ClientUser_IF;
  private number_of_profiles: number = 1;
  private layout: string = 'layout_1';
  private isReady:boolean = false;
  private selectedProfile: ClientProfile_IF = null;
  constructor(
    private afDatabase: AngularFireDatabase,
    private toastCtrl: ToastController,
    public clientDataService: ClientUserDataProvider,
    public navCtrl: NavController,
    public navParams: NavParams,
  ) {
    this.clientUser = this.navParams.get("ClientUser");
    console.log("Family Page Revamped, client user is:",this.clientUser )
    this.number_of_profiles = this.clientUser.profiles.length;
    this.initialize();


  }
  ionViewDidLoad() {

  }
  private initialize(){
    console.log("Initializing client family with number of profiles:", this.number_of_profiles)
    switch(this.number_of_profiles){
      case 1:
        this.layout = 'layout_1';
        break;
      case 2:
        this.layout = 'layout_2';
        break;
      case 3:
        this.layout = 'layout_3';
        break;
      case 4:
        this.layout = 'layout_4'
        break;
      default:
        this.layout = 'layout 1';
        break;
    }
    console.log("The layout has been chosen, it is:", this.layout)
    this.isReady = true;
  }
  private isSelected(profile: ClientProfile_IF){
    if( profile == this.selectedProfile ){
      return "selectedImg";
    }else{
      return null
    }
  }
  private selectProfile(profile: ClientProfile_IF){
    this.selectedProfile = profile;
  }
  private edit(){
    console.log("Editing Family managment settings.")
    this.toastCtrl.create({
      message: 'Family management settings coming soon',
      duration: 2500
    }).present();
  }
  private done_and_proceed(){
    if(this.selectedProfile){
      console.log("Proceeding with selected profile",this.selectedProfile);
      this.clientDataService.updateSelectedProfile(this.selectedProfile);
      this.navCtrl.setRoot( ClientDashboardPage, { SelectedProfile: this.selectedProfile } )
    }
    else{
      this.toastCtrl.create({
        message: 'Please select a profile',
        duration: 2500
      }).present();
    }
  }
}
