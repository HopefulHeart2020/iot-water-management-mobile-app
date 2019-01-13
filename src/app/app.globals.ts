// Imports //
import { MainSettingsPage } from '../pages/settings/settings.component';
import { DashboardPage } from '../pages/dashboard/dashboard.component';
import { AdminClientPage } from '../pages/admin_clients/admin_clients.component';
import { FamilyPage } from '../pages/family_sharing/family_sharing.component';
import { SystemsPage } from '../pages/systems/systems.component';

export const FIREBASE_GLOBALS = {
  USER_ROLES:    "users_roles/",
}
export const ADMIN_PAGES = [
          { title: 'Dashboard', component: DashboardPage, icon: "home" },
          { title: 'All Clients', component: AdminClientPage, icon: "leaf" },
          { title: 'Settings', component: MainSettingsPage, icon: "ios-cog" },
];
export const TECHNICIAN_PAGES = [
          { title: 'Dashboard', component: DashboardPage, icon: "home" },
          { title: 'My Clients', component: SystemsPage, icon: "leaf" },
          { title: 'Settings', component: MainSettingsPage, icon: "ios-cog" },
]
export const CLIENT_PAGES = [
          { title: 'Dashboard', component: DashboardPage, icon: "home" },
          { title: 'My Systems', component: SystemsPage, icon: "leaf" },
          { title: 'My Family', component: FamilyPage, icon: "md-contacts" },
          { title: 'Settings', component: MainSettingsPage, icon: "ios-cog" },
];
export const DEMO_PAGES = [
          { title: 'Dashboard', component: DashboardPage, icon: "home" },
          { title: 'My Systems', component: SystemsPage, icon: "leaf" },
];
