import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ClientSystemsPageRevamped } from './pages/client_systemsRev/client_systemsRev.component';
import { SystemDataProvider } from './providers/system-data/system-data';
import { SystemArgumentsProvider } from './providers/system-arguments/systemArguments.service';
import { ManagerCommandService } from './providers/systems-manager/manage.service';
import { SystemSchedulesProvider } from './providers/system-schedules/system-schedules';
import { GC_MQTT_Service } from './providers/gc-mqtt/gc-mqtt.service';
import { SettingsServiceRevamped } from './providers/system-settings/settingsRev.service';
import { GenericSystem } from './pages/genericSystem/genericSystem.component';
import { SystemOverviewPage } from './pages/genericSystem/tabs/overview/overview.component';
import { SystemHistoryPage } from './pages/genericSystem/tabs/history/history.component';
import { SystemManagePage } from './pages/genericSystem/tabs/manage/manage.component';
// RANDOM MODULES //
import { MultiPickerModule } from 'ion-multi-picker';
// SYSTEM FLAVORS //
import { BushShrikePage } from './pages/genericSystem/components/systemOverviews/bush_Shrike/bush-shrike.component';
import { FishEaglePage } from './pages/genericSystem/components/systemOverviews/fish_Eagle/fish-Eagle.component';
// SETTINGS MODALS //
import { SettingsPageRevamped } from './pages/settingsRev/settingsRev.component';
import { ShrikeZoningSettings } from './pages/settingsRev/components/shrikeZoning/shrikeZoning.component';
import { WaterManagementSettings } from './pages/settingsRev/components/waterManagement/waterSettings.component';
import { SchedulingSettings } from './pages/settingsRev/components/scheduling/scheduling.component';
import { TankSettings } from './pages/settingsRev/components/tanks/tanks.component';
import { AddScheduleComponent } from './pages/settingsRev/components/scheduling/components/addSchedule/addSchedule.component';
// RANDOM COMPONENTS //
import { TankbarComponent } from './components/tankBar/tankbar.component';
import { DimensionInfoModal } from './pages/settingsRev/components/tanks/components/dimensionsInfoModal/dimensionInfoModal.component';
import { ZoneTestingModal } from './pages/genericSystem/tabs/manage/components/zoneTesting/zoneTesting.component';
@NgModule({
    declarations: [
        ClientSystemsPageRevamped,
        GenericSystem,
        SystemOverviewPage,
        SystemHistoryPage,
        SystemManagePage,
        // Settings Page/s
        SettingsPageRevamped,
        ShrikeZoningSettings,
        WaterManagementSettings,
        SchedulingSettings,
        TankSettings,
        // Flavours for overview pages
        FishEaglePage,
        BushShrikePage,
        // Random components
        TankbarComponent,
        DimensionInfoModal,
        AddScheduleComponent,
        ZoneTestingModal
    ],
    imports: [
        IonicPageModule.forChild(ClientSystemsPageRevamped),
        MultiPickerModule
    ],
    providers: [
      SystemDataProvider,
      SystemArgumentsProvider,
      ManagerCommandService,
      SettingsServiceRevamped,
      SystemSchedulesProvider,
      GC_MQTT_Service
    ],
    entryComponents: [
        ClientSystemsPageRevamped,
        GenericSystem,
        SystemOverviewPage,
        SystemHistoryPage,
        SystemManagePage,
        SettingsPageRevamped,
        ShrikeZoningSettings,
        WaterManagementSettings,
        SchedulingSettings,
        TankSettings,
        DimensionInfoModal,
        AddScheduleComponent,
        ZoneTestingModal
    ]
})
export class SystemsPageModule { }
