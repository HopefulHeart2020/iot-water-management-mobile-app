import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, AlertController, Loading, LoadingController } from 'ionic-angular';
import { Observable, BehaviorSubject, Subject, Operator } from 'rxjs/Rx';
import { ClientSystemsPage } from '../../pages/client_systems/client_systems.component';
import { SessionDataProvider } from '../../providers/session-data/session-data';
import { AdminProfile_IF,
         ClientProfile_IF, System_IF
       } from '../../modules/Systems/interfaces/interfaces_all';
import { ClientSystemsPageRevamped } from '../../modules/Systems/pages/client_systemsRev/client_systemsRev.component';
import { AdminUserDataProvider } from "../../providers/admin-data/admin-data";

@Component({
  selector: 'page-admin-clients',
  templateUrl: 'admin_clients.html'
})
export class AdminClientPage {
  private adminProfile: AdminProfile_IF = {} as AdminProfile_IF;
  private adminClients: Array<ClientProfile_IF>;
  private clientsReady: boolean = false;

  private loading: Loading;

  constructor(
    private sessionData: SessionDataProvider,
    private adminData: AdminUserDataProvider,
    private toast: ToastController,
    private loadingCtrl: LoadingController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
  ) {
    this.initialize();
  }
  ionViewDidLoad() {

  }
  ngOnDestroy(){

  }
  private initialize(){
    this.loading = this.loadingCtrl.create({
      content: "Fetching Clients..."
    })
    this.loading.present();

    let adminUser = this.navParams.get("AdminUser")
    if(adminUser){
      this.adminProfile = adminUser.admin_profile;
    }
    else {
      this.adminData.getAdmin_User_BS().take(1).subscribe( _adminUser => {
        adminUser = _adminUser;
        this.adminProfile = adminUser.admin_profile;
      })
    }
    this.adminData.get_AdminClients_BS().take(2).subscribe( clients => {
      console.log("HERE WE ARE,CLIENTS",clients)
      if(clients){
        this.loading.dismiss();
        this.adminClients = clients;
        this.clientsReady = true;
      }
    })
  }
  private viewClientInformation(client: ClientProfile_IF){
    let alert = this.alertCtrl.create({
     title: 'Client Information',
     subTitle: client.first_name + " " + client.last_name,
     message: "Systems: "+ client.systems.length,
     buttons: ['OK']
   });
   alert.present();
  }
  private mapAdminProfile(profile: AdminProfile_IF){
    this.adminProfile = profile as AdminProfile_IF;
    if(this.adminProfile.clients.length == this.adminProfile.client_Objects.length){
      console.log("Clients are ready");
      this.clientsReady = true;
    }
  }
  private addClient(myEvent){
    let title_1: string = "Please enter your client's ChainCode.";
    let sTitle_1: string = "The ChainCode is an key allowing installers' access to their client's systems.";
    let alertContent = {
      title: title_1,
      subTitle: sTitle_1,
      buttons: [
        {
          text: "QR Code",
          handler: data => {

          }
        },
      {
        text: "Type it",
        handler: data => {

        }
      }]
    };
    let alert = this.alertCtrl.create(alertContent);
    alert.present();
  }
  navigateToClient(client: ClientProfile_IF){
    this.loading = this.loadingCtrl.create({
      content: "Fetching Client Information..."
    })
    this.loading.present();
    let systems: Array<System_IF> = [];
    let systemGDIDs = client.systems;
    console.log("CLIENT SYSTEM IDS", systemGDIDs)
    systemGDIDs.forEach((systemGSID,index) => {
      let systemObject: System_IF;
      this.adminData.getSystemObject(systemGSID).take(1).subscribe( _systemObject => {
        console.log("A system object", _systemObject)
        systemObject = _systemObject;
        systems.push(systemObject);
        if(systems.length == client.systems.length){
          client.system_Objects = systems;
          this.loading.dismiss();
          this.navCtrl.push( ClientSystemsPageRevamped, {client: client} );
        }
      })

    })
  }
}
