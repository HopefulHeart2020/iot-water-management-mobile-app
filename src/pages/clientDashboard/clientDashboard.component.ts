import { Component } from '@angular/core';
import {
  NavController, NavParams, ToastController, LoadingController, Loading,
  PopoverController, ModalController, AlertController, ActionSheetController
} from 'ionic-angular';
import { AngularFireDatabase } from "angularfire2/database";
import { Observable } from 'rxjs/Observable';
import { ClientSystemsPageRevamped } from '../../modules/Systems/pages/client_systemsRev/client_systemsRev.component';
import { AdminClientPage } from '../../pages/admin_clients/admin_clients.component';
import { ClientUserDataProvider } from "../../providers/client-data/client-data";
// Widget pages
import { Water_RestrictionsPage } from "../../pages/water_restrictions/restrictions.component";
import { WeatherPage } from "../../pages/weather/weather.component";
import { ToolboxPage } from "../../pages/toolbox/toolbox.component";
import {
  ClientUser_IF,
  ClientProfile_IF,
} from '../../interfaces/client.interfaces';
import { System_IF } from '../../interfaces/interfaces_all';
@Component({
  selector: 'page-client-dashboard',
  templateUrl: 'clientDashboard.html'
})
export class ClientDashboardPage {
  private clientUser: ClientUser_IF;
  private clientProfile: ClientProfile_IF;
  private isReady: boolean = false;
  // UI
  private loading: Loading;
  private widgets: Array<widget> = [];
  constructor(
    private action: ActionSheetController,
    private clientData: ClientUserDataProvider,
    private afDatabase: AngularFireDatabase,
    private toast: ToastController,
    private alertCtrl: AlertController,
    private loadCtrl: LoadingController,
    public modal: ModalController,
    public navCtrl: NavController,
    public navParams: NavParams,
  ) {
    this.clientProfile = this.navParams.get('SelectedProfile');
    this.initialize();

  }
  private initialize() {
    console.log("Initializing Client Dashboard...")
    this.widgets = widgets;
    this.loading = this.loadCtrl.create({
      content: "Linking it up..."
    });
    this.loading.present();
    console.log("Need to fetch client selected profile object..")
    this.clientData.getSelectedProfile_BS().take(1).switchMap(_selectedProfile => {
      console.log("Fetched client selected profile object:", _selectedProfile)
      this.clientProfile = _selectedProfile;
      return this.clientData.getClient_User_BS().take(1);
    }).map(_clientUser => {
      this.clientUser = _clientUser;
      console.log("Finally, we have the client user in dashboard!", this.clientUser)
      this.isReady = true;
      this.loading.dismiss();
    }).subscribe();
  }
  // View Systems
  private navigate_To_Systems(){
    let systems: Array<System_IF>;
    this.clientData.get_SystemObjects_BS().take(1).subscribe( _systems => {
      systems = _systems;
    })
    this.navCtrl.setRoot( ClientSystemsPageRevamped , { clientRev: this.clientUser, Systems: systems  })
  }
  // Action Sheets
  private manage_Widgets() {
    let actionSheet = this.action.create({
      title: 'Manage Widgets',
      buttons: [
        {
          text: 'Add Widget',
          handler: () => {
            this.addWidgetAlert();
          }
        },
        {
          text: 'Delete Widget',
          role: 'destructive',
          handler: () => {
            this.deleteWidgetAlert();
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
  // Widget Management, Addition Alert
  addWidgetAlert() {
    if( !this.widgets.find(widget=>{return !widget.active}) ){
      this.toast.create({
        duration: 2500,
        message: "No available widgets"
      }).present();
      return;
    }
    let alert = this.alertCtrl.create();
    alert.setTitle('Which widget wiould you like to add?');
    let hiddenWidgets = this.widgets.filter( widget => {
      return !widget.active
    });
    for(let widget of hiddenWidgets){
      let id: string = widget.id.toString();
      alert.addInput({
        type: 'checkbox',
        label: widget.name,
        value: id,
        checked: false
      });
    }
    alert.addButton('Cancel');
    alert.addButton({
      text: 'Okay',
      handler: data => {
        console.log("Widget ids", data)
        this.add_Widgets(data)
      }
    });
    alert.present();
  }
  // Widget Management, Addition
  private add_Widgets(widgetIDS: Array<string>){
    for(let id of widgetIDS){
      let _id = parseInt(id);
      this.widgets.forEach( widget => {
        if(widget.id == _id){
          console.log("Adding widget:", widget);
          widget.active = true;
        }
      })
    }
  }
  // Widget Management, Deletion Alert
  deleteWidgetAlert() {
    if( !this.widgets.find(widget=>{return widget.active}) ){
      this.toast.create({
        duration: 2500,
        message: "No widgets to delete"
      }).present();
      return;
    }
    let alert = this.alertCtrl.create();
    alert.setTitle('Which widget wiould you like to hide/remove?');
    let activeWidgets = this.widgets.filter( widget => {
      return widget.active
    });
    for(let widget of activeWidgets){
      let id: string = widget.id.toString();
      alert.addInput({
        type: 'checkbox',
        label: widget.name,
        value: id,
        checked: false
      });
    }
    alert.addButton('Cancel');
    alert.addButton({
      text: 'Okay',
      handler: data => {
        console.log("Widget ids", data)
        this.delete_Widgets(data)
      }
    });
    alert.present();
  }
  // Widget Management, Addition
  private delete_Widgets(widgetIDS: Array<string>){
    for(let id of widgetIDS){
      let _id = parseInt(id);
      this.widgets.forEach( widget => {
        if(widget.id == _id){
          console.log("Adding widget:", widget);
          widget.active = false;
        }
      })
    }
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
  private showLoadShedding(){

  }
}
const widgets: Array<widget> = [
  {
    id: 0,
    name: "Water Restrictions",
    active: true,
    icon: 'ios-water',
    badgeTitle: 'Level',
    buttonText: 'more info',
    badgeText: '5b',
    badgeColor: 'danger'
  },
  {
    id: 1,
    name: "Load Shedding",
    active: false,
    icon: 'md-battery-charging',
    badgeTitle: 'Level',
    buttonText: 'more info',
    badgeText: 'n/a',
    badgeColor: 'sun'
  }
]
interface widget {
  id: number;
  name: string;
  icon: string;
  buttonText: string;
  badgeTitle: string;
  badgeText: string;
  badgeColor: string;
  active: boolean;
  onClick?: () => void;
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
