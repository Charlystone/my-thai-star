import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookTableComponent } from './book-table/container/book-table/book-table.component';
import { AdminCockpitComponent } from './cockpit-area/admin-cockpit/admin-cockpit.component';
import { DishOfTheDayCockpitComponent } from './cockpit-area/dish-of-the-day-cockpit/dish-of-the-day-cockpit.component';
import { OrderArchiveComponent } from './cockpit-area/order-archive-cockpit/order-archive.component';
import { OrderCockpitComponent } from './cockpit-area/order-cockpit/order-cockpit.component';
import { ReservationCockpitComponent } from './cockpit-area/reservation-cockpit/reservation-cockpit.component';
import { AuthGuardService } from './core/authentication/auth-guard.service';
import { NotFoundComponent } from './core/not-found/not-found.component';
import { NotSupportedComponent } from './core/not-supported/not-supported.component';
import { EmailConfirmationsComponent } from './email-confirmations/container/email-confirmations/email-confirmations.component';
import { HomeComponent } from './home/container/home/home.component';
import { MenuComponent } from './menu/container/menu.component';
import { PasswordResetComponent } from './user-area/password-reset/password-reset.component';

const appRoutes: Routes = [
  { path: 'restaurant', component: HomeComponent, pathMatch: 'full' },
  { path: 'menu', component: MenuComponent },
  { path: 'bookTable', component: BookTableComponent },
  { path: 'booking/:action/:token', component: EmailConfirmationsComponent },
  { path: 'passwordreset/:userId/:hashCode', component: PasswordResetComponent },
  {
    path: 'dishoftheday',
    component: DishOfTheDayCockpitComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'orders',
    component: OrderCockpitComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'archive',
    component: OrderArchiveComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'reservations',
    component: ReservationCockpitComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'usermanagement',
    redirectTo: 'usermanagement/all',
    canActivate: [AuthGuardService],
    pathMatch: 'full'
  },
  {
    path: 'usermanagement/:category',
    component: AdminCockpitComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'prediction',
    component: NotSupportedComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'clustering',
    component: NotSupportedComponent,
    canActivate: [AuthGuardService],
  },
  { path: '', redirectTo: '/restaurant', pathMatch: 'full' },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true }, // <-- debugging purposes only
    ),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
