import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { GeneralSettings } from '../../interfaces/generalSettings';
import { AngularFireDatabase } from "angularfire2/database";
import { GC_Authentication } from '../../providers/authentication';
import { Observable } from 'rxjs/Observable';
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class MainSettingsPage {
  private show_Settings: boolean = false;
  private settings: GeneralSettings = {} as GeneralSettings;
  private generalSettings$: Observable<GeneralSettings>
  private uid;
  private role;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public toast: ToastController,
    private afDatabase: AngularFireDatabase,
    private auth: GC_Authentication
  ) {
    let temp = this;
    this.role = this.navParams.get("role");
    if (this.role) {
      this.show_Settings = true;
    }
    this.uid = this.auth.get_uid();
    if (this.uid) {
      this.generalSettings$ = this.afDatabase.object('users/' + this.uid + '/general_settings').valueChanges();
      this.generalSettings$.subscribe(g_settings => {
        temp.settings = g_settings as GeneralSettings;
      })
    }

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
  }
  save() {
    let temp = this;
    let new_Settings = this.afDatabase.object('users/' + this.uid + '/general_settings');
    new_Settings.update({
      familySharing: this.settings.familySharing,
      familyName: this.settings.familyName
    });
    temp.toast.create({
      message: 'Settings saved succesfully.',
      duration: 1500
    }).present();
  }
}
