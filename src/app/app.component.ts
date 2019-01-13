import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, LoadingController, AlertController, MenuController } from 'ionic-angular';
// Native
import { SplashScreen } from '@ionic-native/splash-screen';
// Pages
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from "angularfire2/auth";
import { AngularFireDatabase } from "angularfire2/database";
import { Profile } from "../interfaces/profile";
import { WaterTestsPage } from "../pages/water-tests/water-tests.component";
import { GC_Authentication } from '../providers/authentication';
import { AccountPage } from '../pages/account/account';
import { LoginPage } from '../pages/login/login.component';
import { ProfilePage } from '../pages/profile/profile.component';
import { AdminDashboardPage } from '../pages/adminDashboard/adminDashboard.component';
import { ClientDashboardPage } from '../pages/clientDashboard/clientDashboard.component';
import { IntroPage } from '../pages/intro/intro.component';
import { AdminClientPage } from '../pages/admin_clients/admin_clients.component';
import { MainSettingsPage } from '../pages/settings/settings.component';
import { GeneralSettings } from '../interfaces/generalSettings';
import * as firebase from 'firebase/app';
// Providers //
import { ProfileServiceProvider } from '../providers/profile-service/profile-service';
// Pages //
import { FamilySharingRevamped } from '../pages/family_sharing_rev/family_sharing_rev.component';
import { ClientSystemsPageRevamped } from '../modules/Systems/pages/client_systemsRev/client_systemsRev.component';
// Interfaces //


import {
  UserRole_IF,
  AdminProfile_IF,
  TechnicianProfile_IF,
  ClientProfile_IF,
  System_IF,
  AdminUser_IF,
  newClientUserObject
} from '../interfaces/interfaces_all';
// Globals //
import * as APP_GLOBALS from './app.globals';

@Component({
  selector: 'page-menu',
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  // Lets try again, delete when done..
  private uid: string;
  private role_rev: UserRole_IF = null;
  private role$: Observable<UserRole_IF>;
  private role: UserRole_IF;
  // Client Properties
  private adminUser: AdminUser_IF;
  private clientUser: newClientUserObject;
  // Admin Properties

  // UI and Menu
  private menu_Initialized: boolean = false;
  private full_name: string;
  private generalSettingsRef$: Observable<GeneralSettings>;
  private generalSettings: GeneralSettings;
  rootPage: any;
  loader: any;
  pages: Array<{ title: string, component: any, icon: string }>;
  constructor(
    private afAuth: AngularFireAuth,
    private afDatabase: AngularFireDatabase,
    private gc_auth: GC_Authentication,
    private profileService: ProfileServiceProvider,
    private menu: MenuController,
    public platform: Platform,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    // public push: Push,
    public splash: SplashScreen,
  ) {
    this.initialize();
    this.check_Auth_Status();

  }
  ionViewDidLoad() {

  }
  // Private Functions //
  private initialize() {
    this.platform.ready().then(() => {
      this.splash.hide();
      this.pushSetup();
    })
    this.waitForUserObject();
  }
  private check_Auth_Status() {
    this.afAuth.authState.map(authState => {
      console.log("THE AUTHSTATE IS...", authState)
      if (!authState) {
        console.log("Authstate null, proceeding to login page")
        this.gc_auth.set_Intro_Data_To_Null_On_Logout();
        this.nav.setRoot(LoginPage)
      } else {
        this.uid = authState.uid;
        this.role$ = this.afDatabase.object("users_roles/" + this.uid).valueChanges();
        this.role$.take(1).subscribe(role => {
          if (role) {
            this.role = role as UserRole_IF;
            console.log("This role is", this.role)
            this.initializeMenu(role);
            if (this.uid) {
              this.fetchUserObject(role, this.uid);
            }
          }
        })
      }
    }).subscribe();
  }
  private pushSetup2() {
    var notificationOpenedCallback = function(jsonData) {
      console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
    };

    window["plugins"].OneSignal
      .startInit("8e5ba1c9-1a03-4348-a866-c1ec0efe553f", "YOUR_GOOGLE_PROJECT_NUMBER_IF_ANDROID")
      .handleNotificationOpened(notificationOpenedCallback)
      .endInit();
  }
  private pushSetup() {
    if (this.platform.is('cordova')) {

      var notificationOpenedCallback = function(jsonData) {
        // Do something
      }

      var notificationReceivedCallback = function(jsonData) {
        // Do something
      }
      window["plugins"].OneSignal.setLogLevel({ logLevel: 4, visualLevel: 4 });

      window["plugins"].OneSignal
        .startInit("8e5ba1c9-1a03-4348-a866-c1ec0efe553f", "YOUR_GOOGLE_PROJECT_NUMBER_IF_ANDROID")
        .handleNotificationOpened(notificationOpenedCallback.bind(this))
        .handleNotificationReceived(notificationReceivedCallback.bind(this))
        .endInit();
    } else {
      // Do
      console.log('skipping device token registration since running on desktop device');

    }
  }
  private initializeMenu(role: UserRole_IF) {
    switch (role.roleCode) {
      case 0:
        this.pages = CLIENT_PAGES;
        break;
      case 1:
      case 2:
      case 3:
        this.pages = TECHNICIAN_PAGES;
        break;
      case 4:
      case 5:
        this.pages = ADMIN_PAGES;
        break;
      default:
        this.pages = DEMO_PAGES;
        break;
    }
    if (this.pages) {
      this.menu_Initialized = true;
      console.log("Menu Initialized");
      console.log("PAGES", this.pages)
    }
  }
  private fetchUserObject(role: UserRole_IF, uid: string) {
    switch (role.roleCode) {
      case 0:
        this.profileService.initializeAsClient(this.uid);
        break;
      case 1:
      case 2:
      case 3:
        break;
      case 4:
      case 5:
        this.profileService.initializeAsAdmin(this.uid);
        break;
    }
  }
  private waitForUserObject() {
    this.profileService.awaitUserObject_BS().subscribe(isReady => {
      if (isReady) {
        this.profileService.getUserObject_BS().subscribe(_userProfile => {
          switch (this.role.role) {
            case 'client':
              this.clientUser = _userProfile;
              this.full_name = this.clientUser.profiles[0].first_name + " " + this.clientUser.profiles[0].last_name;
              console.log("App initialized as client", this.clientUser)
              break;
            case 'admin':
              this.adminUser = _userProfile;
              this.full_name = this.adminUser.admin_profile.first_name + " " + this.adminUser.admin_profile.last_name
              console.log("App initialized as admin", this.adminUser)
              break;
            default:
              break;
          }
          this.proceed_To_Intro();
        })
      }
    })
  }
  private proceed_To_Intro() {
    console.log("Proceeding to into, uid:", this.uid);
    console.log("Role", this.role)
    this.nav.setRoot(IntroPage, { uid: this.uid, role: this.role });
  }
  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    if (page.component == MainSettingsPage) {
      if (this.role != undefined) {
        this.nav.setRoot(page.component, { role: this.role })
        return;
      }
    }
    if (page.component == ClientSystemsPageRevamped) {
      this.nav.setRoot(page.component, { Client: this.role })
    }
    this.nav.setRoot(page.component);
    this.menu.close();
  }

  checkForFirstView() {
    this.platform.ready().then(() => {

    });
  }

  presentLoading() {
    this.loader = this.loadingCtrl.create({
      content: "Linking it all up..."
    });
    this.loader.present();
  }
  logout() {
    this.menu.close();
    this.gc_auth.sign_User_Out();
    this.nav.setRoot(LoginPage)
    // this.nav.setRoot(LoginPage);
  }

}
const ADMIN_PAGES = [
  { title: 'Dashboard', component: AdminDashboardPage, icon: "home" },
  { title: 'All Clients', component: AdminClientPage, icon: "leaf" },
  { title: 'Settings', component: MainSettingsPage, icon: "ios-cog" },
];
const TECHNICIAN_PAGES = [
  { title: 'Settings', component: MainSettingsPage, icon: "ios-cog" },
]
const CLIENT_PAGES = [
  { title: 'Dashboard', component: ClientDashboardPage, icon: "home" },
  { title: 'Settings', component: MainSettingsPage, icon: "ios-cog" },
];
const DEMO_PAGES = [
];
