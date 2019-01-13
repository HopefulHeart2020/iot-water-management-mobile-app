import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import { User } from "../../interfaces/user";
import { ProfilePage } from "../../pages/profile/profile.component";
import { IntroPage } from "../../pages/intro/intro.component";
import { AngularFireAuth } from "angularfire2/auth";
import { AngularFireDatabase  } from "angularfire2/database";
import { Profile } from '../../interfaces/profile';
import { Greenchain_Technician_Number } from '../../interfaces/gtn';
import { GC_Authentication } from '../../providers/authentication';
import { Observable } from 'rxjs/Observable';
import { ClientDashboardPage } from '../../pages/clientDashboard/clientDashboard.component'
//import * as firebase from 'firebase/app';
import * as firebase from 'firebase';
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  private userProfileRef$: Observable<Profile>;
  private gtnRef$: Observable<Greenchain_Technician_Number[]>;
  private gtk_to_set;
  private userProfile = {} as Profile;
  private user = {} as User;
  private auth;


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private afAuth: AngularFireAuth,
    private afDatabase: AngularFireDatabase,
    private gc_auth: GC_Authentication,
  ) {
    this.gc_auth.getIntroData_BS().take(1).subscribe( introReady => {
      console.log("Intro Data", introReady)
      if(introReady){
        console.log("Can proceed to intro ")
        this.navCtrl.setRoot( IntroPage, { uid: introReady.uid, role: introReady.role} )
      }else{
        // Do nothing
      }
    })
  }

  // ionViewDidLoad() {
  //   let temp = this;
  //   console.log('ionViewDidLoad LoginPage');
  //   firebase.auth().onAuthStateChanged(function(user) {
  //     if (user) {
  //       // User is signed in.
  //       temp.navCtrl.setRoot(ProfilePage);
  //     } else {
  //       // No user is signed in.
  //     }
  //   });
  // }

  async login(user: User) {
    try {
      const result = await this.afAuth
        .auth
        .signInWithEmailAndPassword(user.email, user.password)
      if (result) {
        console.log("There is a result, can proceed to Intro Page. Result is:", result)

        this.gc_auth.canProceedToIntro(result.uid);
      }
    }
    catch (e) {
      console.error("LOGIN ERROR", e);
      let content: string = "Error: ";
      switch(e.code){
        case "auth/user-not-found":
          content = content.concat("Invalid Email Address")
          break;
        case "auth/wrong-password":
          content = content.concat("Invalid Password")
          break;
        case "auth/network-request-failed":
          content = content.concat("Network Error")
        default:
          content = e;
          break;
      }
      this.presentLoginResultToast(content);
    }
  }
  /*
  UI FUNCTIONS
  */
  private presentLoginResultToast(content: string){
    let toast = this.toastCtrl.create({
      message: content,
      duration: 3000
    }).present();
  }
  check_Information_Before_Registering(user: User) {
    return true;
  }

  async register(user: User, role?: string) {
    if (this.check_Information_Before_Registering(user)) {
      console.log('Yeaa')
      try {
        const result = await this.afAuth
          .auth
          .createUserWithEmailAndPassword(user.email, user.password)
        if (role != undefined) {
          this.saveProfile(role);
        }
        else {
          console.log("The role should be a client")
        }
      }
      catch (e) {
        console.error(e);
      }
      return;
    }
    console.log('Ah no mate!');
  }
  verifyGTN(GTK: string) {
    console.log(GTK);
    this.gtnRef$ = this.afDatabase.list('GC_Keys/').valueChanges();
    this.gtnRef$.subscribe(gtn_keys => {
      let invalid = false;
      for (let gtnKey in gtn_keys) {
        let tempGTK = gtn_keys[gtnKey];
        if (GTK == tempGTK.Key) {
          invalid = true;
          if (tempGTK.Active == false) {
            console.log('Valid GTK, Currently Inactive. Activating..');
            this.set_GTK_active(tempGTK.$key);
            this.register(this.user, 'admin');
          }
        }
      }
      if (!invalid) {
        this.invalidGTK();
      }
    })
  }
  saveProfile(role) {
    this.afAuth.authState.take(1).subscribe(auth => {
      this.userProfile.role = role;
      this.afDatabase.object('users/' + auth.uid).set(this.userProfile)
        .then(() => this.navCtrl.setRoot(ProfilePage, { role: role })
        )
    })
  }
  invalidGTK() {
    let invalidKeyAlert = this.alertCtrl.create({
      title: 'Invalid GTK',
      message: 'You have entered an invalid Greenchain Technicial Key',
      buttons: [
        {
          text: 'Okay',
          handler: () => {
            console.log("Okay On Invalid Key Clicked");
          }
        }
      ]
    }).present();
  }
  set_GTK_active(index) {
    let gtkPath = 'GC_Keys/' + String(index);
    this.gtk_to_set = this.afDatabase.object(gtkPath);
    this.gtk_to_set.update({ 'Active': true });
  }
  showRoleAlert() {
    let roleAlert = this.alertCtrl.create({
      title: 'Are you a certified Greenchain Technician (GT)?',
      message: 'If you click yes, you will be required to fill in your GT Key, otherwise we will assume you are a client.',
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            let gtDetails = this.alertCtrl.create({
              title: 'Greenchain Technician Key',
              message: "All Greenchain Certified Technicians receive a GT Key upon completion of their training.",
              inputs: [
                {
                  name: 'GTK',
                  type: 'string',
                  placeholder: 'GT Key',
                },
              ],
              buttons: [
                {
                  text: 'Cancel',
                  handler: data => {
                    console.log('Cancel clicked');
                  }
                },
                {
                  text: 'Proceed',
                  handler: GTK => {
                    this.verifyGTN(GTK.GTK);
                  }
                }
              ]
            });

            gtDetails.present();
          }
        },
        {
          text: 'Nope',
          handler: () => {
            this.register(this.user);
          }
        }
      ]
    });
    roleAlert.present();
  }
}



// checkRoleAfterLogin(){
//   this.afAuth.authState.subscribe(
//     data => {
//       if (data && data.email && data.uid) {
//         this.userProfileRef$ = this.afDatabase.object('users/' + data.uid);
//         this.userProfileRef$.subscribe( profile => {
//           this.userProfile = profile;
//           if(this.userProfile.role == undefined){
//             console.log("The user has no specified role, must be a client");
//           }
//           else{
//             console.log("Ahh yess")
//           }
//           console.log("Profile: ");
//           console.log( this.userProfile );
//         });
//       }
//     })
// }
