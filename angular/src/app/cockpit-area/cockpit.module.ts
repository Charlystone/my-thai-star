import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoreModule } from '../core/core.module';

import { WaiterCockpitService } from './services/waiter-cockpit.service';
import { WindowService } from '../core/window/window.service';
import { PredictionService } from './services/prediction.service';
import { ClusteringService } from './services/clustering.service';
import { BillService } from './services/bill.service';
import { AdminCockpitService } from './services/admin-cockpit.service';

import { ReservationCockpitComponent } from './reservation-cockpit/reservation-cockpit.component';
import { OrderCockpitComponent } from './order-cockpit/order-cockpit.component';
import { OrderDialogComponent } from './order-cockpit/order-dialog/order-dialog.component';
import { ReservationDialogComponent } from './reservation-cockpit/reservation-dialog/reservation-dialog.component';
import { HttpClientModule } from '@angular/common/http';
import { PredictionCockpitComponent } from './prediction-cockpit/prediction-cockpit.component';
import { ClusteringCockpitComponent } from './clustering-cockpit/clustering-cockpit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslocoRootModule } from '../transloco-root.module';
import { OrderArchiveComponent } from './order-archive-cockpit/order-archive.component';
import {OrderEditComponent} from "./order-cockpit/order-dialog/order-edit/order-edit.component";
import { AdminCockpitComponent } from './admin-cockpit/admin-cockpit.component';
import { CreateUserDialogComponent } from './admin-cockpit/create-user-dialog/create-user-dialog.component';
import { NewPasswordDialogComponent } from './admin-cockpit/new-password-dialog/new-password-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    TranslocoRootModule,
    CoreModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [
    WaiterCockpitService,
    WindowService,
    PredictionService,
    ClusteringService,
    BillService,
    AdminCockpitService,
  ],
  declarations: [
    ReservationCockpitComponent,
    OrderCockpitComponent,
    OrderArchiveComponent,
    ReservationDialogComponent,
    OrderDialogComponent,
    OrderEditComponent,
    PredictionCockpitComponent,
    ClusteringCockpitComponent,
    OrderArchiveComponent,
    AdminCockpitComponent,
    CreateUserDialogComponent,
    NewPasswordDialogComponent,
  ],
  exports: [
    ReservationCockpitComponent,
    OrderCockpitComponent,
    PredictionCockpitComponent,
    ClusteringCockpitComponent,
  ],
  entryComponents: [
    ReservationDialogComponent,
    OrderDialogComponent,
    PredictionCockpitComponent,
    ClusteringCockpitComponent,
  ],
})
export class WaiterCockpitModule { }
