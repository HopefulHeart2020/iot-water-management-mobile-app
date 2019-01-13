import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { LoginPage } from '../login/login.component';
import { ProfilePage } from '../profile/profile.component';
import { AngularFireAuth } from "angularfire2/auth";
import { AngularFireDatabase } from "angularfire2/database";
import { Profile } from "../../interfaces/profile";
import * as firebase from 'firebase/app';
// Interfaces //
import { UserRole_IF } from '../../interfaces/interfaces_all';
// Pages //
import { FamilySharingRevamped } from '../../pages/family_sharing_rev/family_sharing_rev.component';
import { GC_Authentication } from '../../providers/authentication';
// Providers //
import { AdminUserDataProvider } from '../../providers/admin-data/admin-data';
import { ClientUserDataProvider } from '../../providers/client-data/client-data';
import { AdminDashboardPage } from '../../pages/adminDashboard/adminDashboard.component';

import {  ClientProfile_IF,
          AdminUser_IF,
          AdminProfile_IF,
          ClientUser_IF } from '../../interfaces/client.interfaces';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'page-intro',
  templateUrl: 'intro.html'
})
export class IntroPage {
  private role: UserRole_IF;
  private uid: string;

  private userProfileRef$: Observable<Profile>;
  public profile = {} as Profile;
  constructor(
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public navParams: NavParams,
    private afAuth: AngularFireAuth,
    private afDatabase: AngularFireDatabase,
    private adminDataService: AdminUserDataProvider,
    private clientDataService: ClientUserDataProvider,
    private gcAuth: GC_Authentication,
  ) {
    console.log("INITIALIZING INTRO PAGE")
    this.initialize_Intro();
  }

  ionViewDidLoad() {

  }
  private initialize_Intro(){
    this.uid = this.navParams.get('uid');
    this.role = this.navParams.get('role');
    firebase.auth().onAuthStateChanged( user => {
      console.log("Auth State Changed in Intro Component, USER:", user);
      if (user && this.uid && this.role) {
        console.log("User is signed in")
        // User is signed in.
        this.do_Work_Based_On_Role();
      } else{
        this.gcAuth.set_Intro_Data_To_Null_On_Logout();
        this.navCtrl.setRoot(LoginPage)
      }
    });
  }
  private do_Work_Based_On_Role(){
    switch(this.role.roleCode){
      case 0:
        this.initialize_as_Client();
        break;
      case 1:
      case 2:
      case 3:
        break;
      case 4:
      case 5:
        this.initialize_as_Admin();
        //this.navCtrl.setRoot(DashboardPage);
        break;
      default:
        //this.navCtrl.setRoot(LoginPage)
        break;
    }
  }
  private initialize_as_Admin(){
    console.log("Initializing as admin")
    let adminUser: AdminUser_IF;
    this.getAdmin_User_Profile().subscribe( _adminUser => {
      this.adminDataService.initialize_As_Admin(_adminUser, this.role);
      this.navCtrl.setRoot( AdminDashboardPage, { AdminUser: _adminUser });
    })
  }
  private initialize_as_Client(){
    console.log("Initializing as client")
    let clientUser: ClientUser_IF;
    this.getClient_User_Profile().subscribe(_clientUser => {
      this.clientDataService.initialize_As_Client(_clientUser, this.role);
      this.navCtrl.setRoot( FamilySharingRevamped, { ClientUser: _clientUser });
    })

  }
  check_If_Profile_Exists() {
    let loader = this.loadingCtrl.create({
      content: 'Checking Profile Information'
    });
    loader.present();
    this.profile.systems = [];
    this.profile.role = this.navParams.get('role');
    this.afAuth.authState.subscribe(
      data => {
        if (data && data.email && data.uid) {
          this.userProfileRef$ = this.afDatabase.object('users/' + data.uid).valueChanges();
          this.userProfileRef$.subscribe(profile => {
            if (profile.first_name) {
              console.log("Profile already exists")
              loader.dismiss();
              //this.navCtrl.setRoot(DashboardPage);
            }
            else {
              loader.dismiss();
              this.navCtrl.setRoot(ProfilePage, { profile: profile });
            }
          })
        }
        else {

        }
      })
  }
  private getAdmin_User_Profile(){
    let adminUser$: Observable<AdminUser_IF>;
    adminUser$ = this.afDatabase.object("testing/users/admins/"+ this.uid).valueChanges();
    return adminUser$.take(1);
  }
  private getClient_User_Profile(){
    let clientUser$: Observable<ClientUser_IF>;
    clientUser$ = this.afDatabase.object("testing/users/clients/"+ this.uid).valueChanges();
    return clientUser$.take(1);
  }
}
