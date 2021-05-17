import { Component, OnInit } from '@angular/core';
import {OrderListView, UserListView} from '../../shared/view-models/interfaces';
import {Subscription} from 'rxjs';
import {FilterCockpit, Pageable} from '../../shared/backend-models/interfaces';
import {TranslocoService} from '@ngneat/transloco';
import * as moment from "moment";
import {AdminCockpitService} from "../services/admin-cockpit.service";

@Component({
  selector: 'app-admin-cockpit',
  templateUrl: './admin-cockpit.component.html',
  styleUrls: ['./admin-cockpit.component.scss']
})
export class AdminCockpitComponent implements OnInit {

  private translocoSubscription = Subscription.EMPTY;
  private pageable: Pageable = {
    pageSize: 8,
    pageNumber: 0,
    // total: 1,
  };

  users: UserListView[] = [];
  columns: any[];

  totalUsers: number;
  pageSize = 8;

  pageSizes: number[];

  private sorting: any[] = [];

  filters: FilterCockpit = {
    bookingDate: undefined,
    email: undefined,
    bookingToken: undefined,
  };

  displayedColumns: string[] = [
    'userView.email',
    'userView.name',
    'userView.role',
  ];



  constructor(
    private translocoService: TranslocoService,
    private adminCockpitService: AdminCockpitService,

  ) { }

  ngOnInit(): void {
    this.applyFilters();
    this.translocoService.langChanges$.subscribe((event: any) => {
      this.setTableHeaders(event);
      moment.locale(this.translocoService.getActiveLang());
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
        ];
      });
    this.translocoSubscription = this.translocoService
      .selectTranslateObject('alerts.waiterCockpitAlerts', {}, lang)
      .subscribe((alertsWaiterCockpitAlerts) => { });
  }

  printElement(element: any): void{
    console.log(element);
  }

  applyFilters(): void {
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

}
