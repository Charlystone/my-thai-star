import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {OrderListView, UserListView} from '../../shared/view-models/interfaces';
import {Subscription} from 'rxjs';
import {FilterCockpit, Pageable} from '../../shared/backend-models/interfaces';
import {TranslocoService} from '@ngneat/transloco';
import * as moment from "moment";
import {AdminCockpitService} from "../services/admin-cockpit.service";
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ConfigService } from 'app/core/config/config.service';
import {OrderEditComponent} from "../order-cockpit/order-dialog/order-edit/order-edit.component";
import {MatDialog} from "@angular/material/dialog";
import {CreateUserDialogComponent} from "./create-user-dialog/create-user-dialog.component";
import { SnackBarService } from 'app/core/snack-bar/snack-bar.service';
import { NewPasswordDialogComponent } from './new-password-dialog/new-password-dialog.component';
import { Title } from '@angular/platform-browser';
import {EmailConfirmationsService} from "../../email-confirmations/services/email-confirmations.service";


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
  deleteUserSuccessAlert: string;
  displayedColumns: string[] = [
    'userView.email',
    'userView.name',
    'userView.role',
    'userView.setNewPassword',
    'userView.sendResetMail',
    'userView.deleteUser'
  ];

  usersChangedSubscription;

  constructor(
    private dialog: MatDialog,
    private translocoService: TranslocoService,
    private adminCockpitService: AdminCockpitService,
    private configService: ConfigService,
    private snackBarService: SnackBarService,
    private emailConfirmationsService: EmailConfirmationsService,
    title: Title
  ) {
    title.setTitle('Benutzerverwaltung');
    this.pageSizes = this.configService.getValues().pageSizes;
   }

  ngOnDestroy(): void {
    this.usersChangedSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.loadUsers();
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
      });
  }

  loadUsers(): void {
    this.adminCockpitService
      .getUsers(this.pageable, this.sorting, this.filters)
      .subscribe((data: any) => {
        if (!data) {
          this.users = [];
        } else {
          this.users = data.content;
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

  loadUsersByRole(roleId: number): void{
    this.adminCockpitService
      .getUsers(this.pageable, this.sorting, this.filters)
      .subscribe((data: any) => {
        if (!data) {
          this.users = [];
        } else {
          this.users = [];
          for (let user of data.content) {
            if (user.userRoleId === roleId) {
              this.users.push(user);
            }
          }
        }
        this.totalUsers = this.users.length;
      });
  }

  createUserDialog(): void {
    this.dialog.open(CreateUserDialogComponent, {
      width: '25%'
    });
  }

  deleteUser(element: any): void {
    this.adminCockpitService.deleteUser(element.id).subscribe((data: any) => {
      this.adminCockpitService.emitUsersChanged();
      this.snackBarService.openSnack(this.deleteUserSuccessAlert, 5000, "green");
    });
  }

  setNewPassword(element: any): void {
    this.dialog.open(NewPasswordDialogComponent, {
      width: '25%',
      data : element
    });
  }

  sendEmailForPasswordReset(element: any): void {
    this.emailConfirmationsService.sendResetPasswordEmail(element).subscribe((data: any) => {
      
    });
  }
}
