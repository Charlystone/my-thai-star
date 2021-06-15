import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {UserListView} from '../../shared/view-models/interfaces';
import {Subscription} from 'rxjs';
import {FilterCockpit, Pageable} from '../../shared/backend-models/interfaces';
import {TranslocoService} from '@ngneat/transloco';
import * as moment from "moment";
import {AdminCockpitService} from "../services/admin-cockpit.service";
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ConfigService } from 'app/core/config/config.service';
import {MatDialog} from "@angular/material/dialog";
import {CreateUserDialogComponent} from "./create-user-dialog/create-user-dialog.component";
import { SnackBarService } from 'app/core/snack-bar/snack-bar.service';
import { NewPasswordDialogComponent } from './new-password-dialog/new-password-dialog.component';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute} from '@angular/router';
import { AuthService } from 'app/core/authentication/auth.service';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../store';


@Component({
  selector: 'app-admin-cockpit',
  templateUrl: './admin-cockpit.component.html',
  styleUrls: ['./admin-cockpit.component.scss']
})
export class AdminCockpitComponent implements OnInit, OnDestroy {

  private translocoSubscription = Subscription.EMPTY;
  private pageable: Pageable = {
    pageSize: 8,
    pageNumber: 0,
    // total: 1,
  };
 @ViewChild('pagingBar', { static: true }) pagingBar: MatPaginator;

  users: UserListView[] = [];
  columns: any[];

  totalUsers: number;
  pageSize = 8;

  pageSizes: number[];

  private sorting: any[] = [];
  data: any;
  filters: FilterCockpit = {
    bookingDate: undefined,
    email: undefined,
    bookingToken: undefined,
  };

  displayedColumns: string[] = [
    'userView.email',
    'userView.name',
    'userView.role',
    'userView.setNewPassword',
    'userView.sendResetMail',
    'userView.deleteUser'
  ];

  deleteUserSuccessAlert: string;
  deleteUserFailAlert: string;
  resetLinkSuccessAlert: string;
  usersChangedSubscription;
  userCategoryId: number;
  activatedRouteSubscription;

  constructor(
    private dialog: MatDialog,
    private translocoService: TranslocoService,
    private adminCockpitService: AdminCockpitService,
    private configService: ConfigService,
    private snackBarService: SnackBarService,
    public auth: AuthService,
    private activatedRoute: ActivatedRoute,
    private store: Store<fromRoot.State>,
    title: Title
  ) {
    title.setTitle('Benutzerverwaltung');
    this.pageSizes = this.configService.getValues().pageSizes;
   }

  ngOnDestroy(): void {
    this.usersChangedSubscription.unsubscribe();
    this.activatedRouteSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.activatedRouteSubscription = this.activatedRoute.params.subscribe(
      params => {
        switch (params.category) {
          case 'all':
            this.userCategoryId = -1;
            break;
          case 'customers':
            this.userCategoryId = 0;
            break;
          case 'waiters':
            this.userCategoryId = 1;
            break;
          case 'managers':
            this.userCategoryId = 2;
            break;
          case 'admins':
            this.userCategoryId = 3;
            break;
        }
        this.loadUsers();
      });
    this.translocoService.langChanges$.subscribe((event: any) => {
      this.setTableHeaders(event);
      moment.locale(this.translocoService.getActiveLang());
    });

    this.usersChangedSubscription = this.adminCockpitService.usersChanged.subscribe(() => {
      this.loadUsers();
    });
  }

  setTableHeaders(lang: string): void {
    this.translocoSubscription = this.translocoService
      .selectTranslateObject('cockpit.users', {}, lang)
      .subscribe((cockpitTable) => {
        this.columns = [
          { name: 'userView.email', label: cockpitTable.emailH },
          { name: 'userView.name', label: cockpitTable.nameH },
          { name: 'userView.role', label: cockpitTable.roleH },
          { name: 'userView.setNewPassword', label: cockpitTable.newPasswordH },
          { name: 'userView.sendResetMail', label: cockpitTable.passwordResetMailH },
          { name: 'userView.deleteUser', label: cockpitTable.deleteUserH },
        ];
      });
      this.translocoSubscription = this.translocoService
      .selectTranslateObject('alerts.adminCockpitAlerts', {}, lang)
      .subscribe((alertsAdminCockpitAlerts) => {
        this.deleteUserSuccessAlert = alertsAdminCockpitAlerts.deleteUserSuccess;
        this.resetLinkSuccessAlert = alertsAdminCockpitAlerts.resetLinkSuccess;
        this.deleteUserFailAlert = alertsAdminCockpitAlerts.deleteUserFail;
      });
  }

  loadUsers(): void {
    this.adminCockpitService
      .getUsers(this.pageable, this.sorting, this.filters)
      .subscribe((data: any) => {
        if (!data) {
          this.users = [];
        } else {
          if (this.userCategoryId === -1) {
            this.users = data.content;
          } else {
            this.users = [];
            for (let user of data.content) {
              if (user.userRoleId === this.userCategoryId) {
                this.users.push(user);
              }
            }
          }
        }
        this.totalUsers = this.users.length;
      });
  }

  page(pagingEvent: PageEvent): void {
    this.pageable = {
      pageSize: pagingEvent.pageSize,
      pageNumber: pagingEvent.pageIndex,
      sort: this.pageable.sort,
    };
    this.loadUsers();
  }

  createUserDialog(): void {
    this.dialog.open(CreateUserDialogComponent, {
      width: '40%'
    });
  }

  deleteUser(element: any): void {
    if (confirm('Benutzer wirklich löschen?')) {
      this.adminCockpitService.deleteUser(element.id).subscribe((data: any) => {
      this.adminCockpitService.emitUsersChanged();
      this.snackBarService.openSnack(this.deleteUserSuccessAlert, 5000, "green");
      },
      (error: any) => {
        this.snackBarService.openSnack(this.deleteUserFailAlert, 5000, "red");
      });
    }
    
  }

  setNewPassword(element: any): void {
    this.dialog.open(NewPasswordDialogComponent, {
      width: '40%',
      data : element
    });
  }

  sendEmailForPasswordReset(element: any): void {
    if (confirm('Rücksetzlink versenden?')) {
      this.adminCockpitService.sendPasswordResetEmail(element).subscribe((data: any) => {
        this.snackBarService.openSnack(this.resetLinkSuccessAlert, 5000, "green");
      });
    }
  }
}
