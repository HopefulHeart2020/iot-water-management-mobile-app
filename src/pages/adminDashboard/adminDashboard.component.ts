import { Component } from '@angular/core';
import {
  NavController, NavParams, ToastController, LoadingController, Loading,
  PopoverController, ModalController, AlertController, ActionSheetController
} from 'ionic-angular';
import { AngularFireDatabase } from "angularfire2/database";
import { Observable } from 'rxjs/Observable';
import { ClientProfile_IF, UserRole_IF } from '../../interfaces/interfaces_all';
import { ClientSystemsPageRevamped } from '../../modules/Systems/pages/client_systemsRev/client_systemsRev.component';
import { AdminClientPage } from '../../pages/admin_clients/admin_clients.component';
import { AdminUserDataProvider } from "../../providers/admin-data/admin-data";
// Widget pages
import { Water_RestrictionsPage } from "../../pages/water_restrictions/restrictions.component";
import { WeatherPage } from "../../pages/weather/weather.component";
import { ToolboxPage } from "../../pages/toolbox/toolbox.component";

@Component({
  selector: 'page-admin-dashboard',
  templateUrl: 'adminDashboard.html'
})
export class AdminDashboardPage {
  private adminUser: AdminUser_IF;
  private isReady: boolean = false;
  // UI
  private loading: Loading;
  constructor(
    private action: ActionSheetController,
    private adminData: AdminUserDataProvider,
    private afDatabase: AngularFireDatabase,
    private toast: ToastController,
    private alertCtrl: AlertController,
    private loadCtrl: LoadingController,
    public modal: ModalController,
    public navCtrl: NavController,
    public navParams: NavParams,
  ) {
    this.adminUser = this.navParams.get('AdminUser');
    this.initialize();

  }
  private initialize() {
    console.log("Initializing Admin Dashboard...")
    this.loading = this.loadCtrl.create({
      content: "Linking it up..."
    });
    this.loading.present();
    if (this.adminUser) {
      this.isReady = true;
      this.loading.dismiss();
    } else {
      this.adminData.getAdmin_User_BS().take(1).subscribe(_adminUser => {
        this.adminUser = _adminUser;
        this.isReady = true;
        this.loading.dismiss();
      })
    }
  }
  // Routes to other pages
  private viewAdminClients() {
    this.navCtrl.setRoot(AdminClientPage, { AdminUser: this.adminUser })
  }
  // Action Sheets
  private manage_Widgets() {
    let actionSheet = this.action.create({
      title: 'Manage Widgets',
      buttons: [
        {
          text: 'Add Widget',
          handler: () => {

          }
        },
        {
          text: 'Delete Widget',
          role: 'destructive',
          handler: () => {
          }
        },

        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }
  // Widgets
  showWaterRestriction_Action_Sheet() {
    let actionSheet = this.action.create({
      title: 'Water Restrictions',
      buttons: [
        {
          text: 'What does this mean?',
          handler: () => {
            this.presentRestrictionsPopover("R_specific");
          }
        },
        {
          text: 'Restriction Information',
          role: 'destructive',
          handler: () => {
            this.presentRestrictionsPopover("R_general");
          }
        },

        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }
  presentRestrictionsPopover(WHICH_CONTENT) {
    let restrictionsModal = this.modal.create(Water_RestrictionsPage, { option: WHICH_CONTENT });
    restrictionsModal.present();
  }
  presentWeatherPopover() {
    let weatherModal = this.modal.create(WeatherPage);
    weatherModal.present();
  }
  presentToolboxModal() {
    let toolBoxModal = this.modal.create(ToolboxPage);
    toolBoxModal.present();
  }
}
interface AdminUser_IF {
  admin_profile: AdminProfile_IF;
  email: string;
  clients: Array<string>;

}
interface AdminProfile_IF {
  first_name: string;
  last_name: string;
  username: string;
}
