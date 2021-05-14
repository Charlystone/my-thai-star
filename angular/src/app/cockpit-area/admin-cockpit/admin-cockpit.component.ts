import { Component, OnInit } from '@angular/core';
import {OrderListView, UserListView} from '../../shared/view-models/interfaces';
import {Subscription} from 'rxjs';
import {Pageable} from '../../shared/backend-models/interfaces';
import {TranslocoService} from '@ngneat/transloco';

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


  displayedColumns: string[] = [
    'userLine.email',
  ];



  constructor(
    private translocoService: TranslocoService,
  ) { }

  ngOnInit(): void {
  }

  setTableHeaders(lang: string): void {
    this.translocoSubscription = this.translocoService
      .selectTranslateObject('cockpit.table', {}, lang)
      .subscribe((adminCockpitTable) => {
        this.columns = [
          { name: 'booking.email', label: adminCockpitTable.emailH },
        ];
      });
    this.translocoSubscription = this.translocoService
      .selectTranslateObject('alerts.waiterCockpitAlerts', {}, lang)
      .subscribe((alertsWaiterCockpitAlerts) => { });
  }

  printElement(element: any): void{
    console.log(element);
  }

}
