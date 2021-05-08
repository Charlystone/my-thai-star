import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { TranslocoService } from '@ngneat/transloco';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { ConfigService } from '../../core/config/config.service';
import {
  FilterCockpit,
  Pageable,
} from '../../shared/backend-models/interfaces';
import { OrderListView } from '../../shared/view-models/interfaces';
import { WaiterCockpitService } from '../services/waiter-cockpit.service';
import { OrderDialogComponent } from './order-dialog/order-dialog.component';
import {FormControl} from '@angular/forms';
import { SnackBarService } from 'app/core/snack-bar/snack-bar.service';
@Component({
  selector: 'app-cockpit-order-cockpit',
  templateUrl: './order-cockpit.component.html',
  styleUrls: ['./order-cockpit.component.scss'],
})
export class OrderCockpitComponent implements OnInit, OnDestroy {
  private translocoSubscription = Subscription.EMPTY;
  private pageable: Pageable = {
    pageSize: 8,
    pageNumber: 0,
    // total: 1,
  };
  private sorting: any[] = [];

  pageSize = 8;

  @ViewChild('pagingBar', { static: true }) pagingBar: MatPaginator;

  orders: OrderListView[] = [];
  totalOrders: number;

  columns: any[];
  states: any[];
  stateUpdateSuccessAlert: string;

  displayedColumns: string[] = [
    'booking.bookingDate',
    'booking.email',
    'booking.table',
    'booking.paymentState',
    'booking.orderState', //abd
  ];

  pageSizes: number[];

  filters: FilterCockpit = {
    bookingDate: undefined,
    email: undefined,
    bookingToken: undefined,
  };
  

  constructor(
    private dialog: MatDialog,
    private translocoService: TranslocoService,
    private waiterCockpitService: WaiterCockpitService,
    private configService: ConfigService,
    private snackBarService: SnackBarService
  ) {
    this.pageSizes = this.configService.getValues().pageSizes;
  }

  ngOnInit(): void {
    this.applyFilters();
    this.translocoService.langChanges$.subscribe((event: any) => {
      this.setTableHeaders(event);
      moment.locale(this.translocoService.getActiveLang());
    });
  }

  setTableHeaders(lang: string): void {
    this.translocoSubscription = this.translocoService
      .selectTranslateObject('cockpit.table', {}, lang)
      .subscribe((cockpitTable) => {
        this.columns = [
          { name: 'booking.bookingDate', label: cockpitTable.reservationDateH },
          { name: 'booking.email', label: cockpitTable.emailH },
          { name: 'booking.table', label: cockpitTable.tableH },
          { name: 'booking.paymentState', label: cockpitTable.paymentStateH },
          { name: 'booking.orderState', label: cockpitTable.orderStateH }, //abd
        ];
      });
      this.translocoSubscription = this.translocoService
      .selectTranslateObject('cockpit.states', {}, lang)
      .subscribe((cockpitStates) => {
        this.states = [
          { name: 'orderTaken', label: cockpitStates.orderTakenH },
          { name: 'deliveringOrder', label: cockpitStates.deliveringOrderH },
          { name: 'orderDelivered', label: cockpitStates.orderDeliveredH }, //abd
          { name: 'orderCompleted', label: cockpitStates.orderCompletedH }
        ];
      });
      this.translocoSubscription = this.translocoService
      .selectTranslateObject('alerts.orderStateAlerts', {}, lang)
      .subscribe((alertsOrderStateAlerts) => {
        this.stateUpdateSuccessAlert = alertsOrderStateAlerts.updateStateSuccess;
      });
  }

  applyFilters(): void {
    this.waiterCockpitService
      .getOrders(this.pageable, this.sorting, this.filters)
      .subscribe((data: any) => {
        if (!data) {
          this.orders = [];
        } else {
          this.orders = [];
          for (let entry of data.content) {
            if (!(entry.order.state == "canceled" || entry.order.state == "orderCompleted")) {
              this.orders.push(entry);
            }
          }
        }
        this.totalOrders = this.orders.length;
      });
  }

  clearFilters(filters: any): void {
    filters.reset();
    this.applyFilters();
    this.pagingBar.firstPage();
  }

  page(pagingEvent: PageEvent): void {
    this.pageable = {
      pageSize: pagingEvent.pageSize,
      pageNumber: pagingEvent.pageIndex,
      sort: this.pageable.sort,
    };
    this.applyFilters();
  }

  sort(sortEvent: Sort): void {
    this.sorting = [];
    if (sortEvent.direction) {
      this.sorting.push({
        property: sortEvent.active,
        direction: '' + sortEvent.direction,
      });
    }
    this.applyFilters();
  }

  selected(selection: OrderListView): void {
    this.dialog.open(OrderDialogComponent, {
      width: '80%',
      data: selection,
    });
  } 
  
  updateState(option , selectedOrder: OrderListView):void {
    this.orders[this.orders.indexOf(selectedOrder)].state= option.name;//abd
    const str = JSON.stringify(this.orders[this.orders.indexOf(selectedOrder)]);
    const obj = JSON.parse(str);
    const id = obj.order.id;
    this.waiterCockpitService.postBookingState(this.orders[this.orders.indexOf(selectedOrder)].state, id).subscribe((data: any) => {
      this.applyFilters();
      this.snackBarService.openSnack(this.stateUpdateSuccessAlert, 5000, "green");
    });
  }

  ngOnDestroy(): void {
    this.translocoSubscription.unsubscribe();
  }
}
