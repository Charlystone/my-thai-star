import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminCockpitComponent } from './admin-cockpit.component';

export const adminCockpitRoutes: Routes = [
    { path: 'all', component: AdminCockpitComponent },
    { path: 'customers', component: AdminCockpitComponent },
    { path: 'waiters', component: AdminCockpitComponent },
    { path: 'managers', component: AdminCockpitComponent },
    { path: 'admins', component: AdminCockpitComponent }
  ];