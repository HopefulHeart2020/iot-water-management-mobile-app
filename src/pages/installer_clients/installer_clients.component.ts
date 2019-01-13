import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { AngularFireAuth } from "angularfire2/auth";
import { AngularFireDatabase } from "angularfire2/database";
import { Profile } from "../../interfaces/profile";
import { ChainWeather } from "../../providers/weather2";
import { Observable } from 'rxjs/Observable';
@Component({
  selector: 'page-installer-clients',
  templateUrl: 'installer_clients.html'
})
export class InstallerClientsPage {

  profileData: Observable<Profile>

  constructor(
    private afAuth: AngularFireAuth,
    private afDatabase: AngularFireDatabase,
    private toast: ToastController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public weather: ChainWeather,
  ) {

  }
  ionViewDidLoad() {
    this.afAuth.authState.subscribe(
      data => {
        if (data && data.email && data.uid) {
          this.toast.create({
            message: 'Welcome aboard the Greenchain, ' + data.email ,
            duration: 4000
          }).present();

          this.profileData = this.afDatabase.object('users/' + data.uid).valueChanges();
        }
        else {
          this.toast.create({
            message: 'Could not find authentication details',
            duration: 4000
          }).present();
        }
      })


  }

}
