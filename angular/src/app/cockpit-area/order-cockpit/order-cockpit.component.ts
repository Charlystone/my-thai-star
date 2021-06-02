import { Component, Injectable, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
import {OrderEditComponent} from "./order-dialog/order-edit/order-edit.component";
import { SnackBarService } from 'app/core/snack-bar/snack-bar.service';
import { BillService } from '../services/bill.service';
import { ChildActivationEnd } from '@angular/router';
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
  orderStateUpdateSuccessAlert: string;
  orderStateUpdateNotAllowed: string;
  paymentStateUpdateSuccessAlert: string;

  orderChangedSubscription;

  displayedColumns: string[] = [
    'booking.bookingDate',
    'booking.email',
    'booking.table',
    'buttons.edit',
    'booking.paymentState',
    'booking.orderState',
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
    private snackBarService: SnackBarService,
    private billService: BillService
  ) {
    this.pageSizes = this.configService.getValues().pageSizes;
  }

  ngOnInit(): void {
    this.applyFilters();
    this.translocoService.langChanges$.subscribe((event: any) => {
      this.setTableHeaders(event);
      moment.locale(this.translocoService.getActiveLang());
    });

    this.orderChangedSubscription = this.waiterCockpitService.ordersChanged.subscribe(() => {
      this.applyFilters();
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
          { name: 'buttons.edit', label: cockpitTable.editH},
          { name: 'booking.paymentState', label: cockpitTable.paymentStateH },
          { name: 'booking.orderState', label: cockpitTable.orderStateH },
        ];
      });
      this.translocoSubscription = this.translocoService
      .selectTranslateObject('alerts.waiterCockpitAlerts', {}, lang)
      .subscribe((alertsWaiterCockpitAlerts) => {
        this.orderStateUpdateSuccessAlert = alertsWaiterCockpitAlerts.updateOrderStateSuccess;
        this.paymentStateUpdateSuccessAlert = alertsWaiterCockpitAlerts.updatePaymentStateSuccess;
        this.orderStateUpdateNotAllowed = alertsWaiterCockpitAlerts.updateOrderStateNotAllowed;
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
            if (!(entry.order.orderState === "canceled" || entry.order.orderState === "orderCompleted")) {
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

  selected(selection: any): void {
    this.dialog.open(OrderDialogComponent, {
      width: '80%',
      data: selection,
    });
  }

  selectedEdit(selection: any): void {
    this.dialog.open(OrderEditComponent, {
      width: '80%',
      data: selection,
    });
  }

  updateOrderState(selectedOrder: any, button):void {
    const currentOrderState = selectedOrder.order.orderState;
    const currentPaymentState = selectedOrder.order.paymentState;
    let orderStateToUpdateTo;
    let currentColor;
    let colorToUpdateTo;
    switch (currentOrderState) {
      case 'orderTaken':
        orderStateToUpdateTo = 'orderDelivered';
        currentColor = 'grey';
        colorToUpdateTo = '#388e3c';
        break;
      case 'orderDelivered':
        orderStateToUpdateTo = 'orderCompleted';
        currentColor = '#388e3c';
        colorToUpdateTo = 'black';
        break;
    }
    if (orderStateToUpdateTo == 'orderCompleted' && currentPaymentState == 'pending') {
      this.snackBarService.openSnack(this.orderStateUpdateNotAllowed, 5000, "red");
    } else {
      button.lastElementChild.animate([
        {transform: 'translateX(0)', width: '100%', backgroundColor: currentColor},
        {transform: 'translateX(-112.5px)', width: '150px', backgroundColor: colorToUpdateTo},
      ], 300);
      button.lastElementChild.style.width = '150px';
      button.lastElementChild.style.transform = 'translateX(-112.5px)';
      button.lastElementChild.style.backgroundColor = colorToUpdateTo;
      this.orders[this.orders.indexOf(selectedOrder)].orderState = orderStateToUpdateTo;
      const str = JSON.stringify(this.orders[this.orders.indexOf(selectedOrder)]);
      const obj = JSON.parse(str);
      const id = obj.order.id;
      this.waiterCockpitService.updateOrderState(this.orders[this.orders.indexOf(selectedOrder)].orderState, id).subscribe((data: any) => {
        this.applyFilters();
        this.snackBarService.openSnack(this.orderStateUpdateSuccessAlert, 5000, "green");
      });
    }
  }

  payBill(selectedOrder: any):void {
    this.orders[this.orders.indexOf(selectedOrder)].paymentState = 'paid';
    const str = JSON.stringify(this.orders[this.orders.indexOf(selectedOrder)]);
    const obj = JSON.parse(str);
    const id = obj.order.id;
    this.waiterCockpitService.updatePaymentState(this.orders[this.orders.indexOf(selectedOrder)].paymentState, id).subscribe((data: any) => {
      this.applyFilters();
      this.snackBarService.openSnack(this.paymentStateUpdateSuccessAlert, 5000, "green");
      this.billService.createBillAsPDF(selectedOrder);
    })
  }

  ngOnDestroy(): void {
    if (this.translocoSubscription){
      this.translocoSubscription.unsubscribe();
    }
    if (this.orderChangedSubscription){
      this.translocoSubscription.unsubscribe();
    }
  }
}
