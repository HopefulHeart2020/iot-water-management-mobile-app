import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { AngularFireAuth } from "angularfire2/auth";
import { AngularFireDatabase } from "angularfire2/database";
import { Profile } from "../../interfaces/profile";
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  private uid;
  profile = {} as Profile;
  private userProfileRef$: Observable<Profile>;
  constructor(
    private afAuth: AngularFireAuth,
    private afDatabase: AngularFireDatabase,
    public navCtrl: NavController,
    public navParams: NavParams,
    public loading: LoadingController,
   )
   {

     this.profile = this.navParams.get('profile') as Profile;
     console.log(this.profile)

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');

  }
  saveProfile(){
    this.afAuth.authState.take(1).subscribe(auth => {
      this.profile.email = auth.email;
      this.afDatabase.object('users/' + auth.uid).set(this.profile)
      .then(() => {}
    )
    })
  }

}
