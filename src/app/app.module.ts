// App Itself //
import { MyApp } from './app.component';
// Miscelaneous //
import '../../node_modules/chart.js/dist/Chart.bundle.min.js';
// Modules //
import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { MultiPickerModule } from 'ion-multi-picker';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule} from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { HttpModule } from '@angular/http';
// Greenchain Modules //
import { SystemsPageModule } from '../modules/Systems/systems.module';
// Pages //
import { ClientDashboardPage } from '../pages/clientDashboard/clientDashboard.component';
import { AdminDashboardPage } from '../pages/adminDashboard/adminDashboard.component';
import { FamilySharingRevamped } from '../pages/family_sharing_rev/family_sharing_rev.component';
import { LoginPage } from '../pages/login/login.component';
import { RegisterPage } from '../pages/register/register.component';
import { IntroPage } from '../pages/intro/intro.component';
import { MainSettingsPage } from '../pages/settings/settings.component';
import { ProfilePage } from '../pages/profile/profile.component';
import { AdminClientPage } from '../pages/admin_clients/admin_clients.component';
import { InstallerClientsPage } from '../pages/installer_clients/installer_clients.component';
import { SystemLocationPage } from '../pages/system-location/system-location.component';
import { PopoverPage } from '../pages/systems-popover/systems-popover';
import { Water_RestrictionsPage } from '../pages/water_restrictions/restrictions.component';
import { WeatherPage } from '../pages/weather/weather.component';
import { ToolboxPage } from '../pages/toolbox/toolbox.component';
import { WaterTestsPage } from '../pages/water-tests/water-tests.component';
// Popovers/Modals //
import { WaterTestPopover } from '../pages/waterTest_Popover/wt_Popover.component';
// Providers //
import { ChainWeather } from '../providers/weather2';
import { GC_Authentication } from '../providers/authentication';
import { QR_Scanner } from '../providers/qr_scan';
import { Camera } from '@ionic-native/camera';
import { BarcodeScanner  } from '@ionic-native/barcode-scanner';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';
import { SystemTestingProvider } from '../providers/system-testing/system-testing';
import { GeofireProvider } from '../providers/geofire/geofire';
import { SessionDataProvider } from '../providers/session-data/session-data';
import { AdminUserDataProvider } from '../providers/admin-data/admin-data';
import { ClientUserDataProvider } from '../providers/client-data/client-data';
import { ProfileServiceProvider } from '../providers/profile-service/profile-service';
import { PageGmapAutocomplete } from '../pages/page-gmap-autocomplete/page-gmap-autocomplete';
import { ModalAutocompleteItems } from '../pages/modal-autocomplete-items/modal-autocomplete-items';
//import { Push } from '@ionic-native/push';
import { SplashScreen } from '@ionic-native/splash-screen';
// Configuration //
import { FIREBASE_CONFIG } from './app.firebase.config';


@NgModule({
  // Declarations are for components which would be included in this module
  declarations: [
    MyApp,
    IntroPage,
    MainSettingsPage,
    AdminClientPage,
    PopoverPage,
    LoginPage,
    ProfilePage,
    Water_RestrictionsPage,
    InstallerClientsPage,
    WeatherPage,
    ToolboxPage,
    WaterTestsPage,
    WaterTestPopover,
    SystemLocationPage,
    PageGmapAutocomplete,
    ModalAutocompleteItems,
    FamilySharingRevamped,
    AdminDashboardPage,
    ClientDashboardPage
  ],
  // Imports allows you to import other modules into the app
  imports: [
    IonicModule.forRoot(MyApp),
    BrowserModule,
    AngularFireModule.initializeApp(FIREBASE_CONFIG),
    FormsModule,
    HttpModule,
    SystemsPageModule,
    MultiPickerModule,
    AngularFireAuthModule,
    AngularFireDatabaseModule,
  ],
  bootstrap: [IonicApp ],
  entryComponents: [
    MyApp,
    IntroPage,
    LoginPage,
    ProfilePage,
    MainSettingsPage,
    Water_RestrictionsPage,
    AdminClientPage,
    PopoverPage,
    InstallerClientsPage,
    WeatherPage,
    ToolboxPage,
    WaterTestsPage,
    WaterTestPopover,
    SystemLocationPage,
    PageGmapAutocomplete,
    ModalAutocompleteItems,
    FamilySharingRevamped,
    AdminDashboardPage,
    ClientDashboardPage
  ],
  providers: [
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    SplashScreen,
    ChainWeather,
    GC_Authentication,
    Camera,
    BarcodeScanner,
    QR_Scanner,
    SystemTestingProvider,
    GeofireProvider,
    SessionDataProvider,
    AdminUserDataProvider,
    ClientUserDataProvider,
    ProfileServiceProvider,
  //  Push,
  ]
})
export class AppModule { }
