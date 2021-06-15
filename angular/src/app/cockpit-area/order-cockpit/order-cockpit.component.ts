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
import { OrderEditComponent } from "./order-edit-dialog/order-edit-dialog.component";
import { SnackBarService } from 'app/core/snack-bar/snack-bar.service';
import { BillService } from '../services/bill.service';
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
  orderStateUpdateFailAlert: string;
  orderStateUpdateNotAllowed: string;
  paymentStateUpdateSuccessAlert: string;
  paymentStateUpdateFailAlert: string;

  orderChangedSubscription;

  displayedColumns: string[] = [
    'booking.bookingDate',
    'booking.name',
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
          { name: 'booking.name', label: cockpitTable.guestNameH },
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
        this.orderStateUpdateFailAlert = alertsWaiterCockpitAlerts.updateOrderStateFail;
        this.paymentStateUpdateSuccessAlert = alertsWaiterCockpitAlerts.updatePaymentStateSuccess;
        this.paymentStateUpdateFailAlert = alertsWaiterCockpitAlerts.updatePaymentStateFail;
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
          this.orders = data.content;
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

  selectedEdit(selection: any, event: any): void {
    this.dialog.open(OrderEditComponent, {
      width: '80%',
      data: selection,
      autoFocus: false,
    });
    event.stopPropagation();
  }

  updateOrderState(selectedOrder: any, button, event: any):void {
    if (confirm('Statusänderung wirklich durchführen?')) {
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
        this.animateOrderStateButton(button, currentColor, colorToUpdateTo);
        setTimeout(() => {
          this.orders[this.orders.indexOf(selectedOrder)].orderState = orderStateToUpdateTo;
          const str = JSON.stringify(this.orders[this.orders.indexOf(selectedOrder)]);
          const obj = JSON.parse(str);
          const id = obj.order.id;
          this.waiterCockpitService.updateOrderState(this.orders[this.orders.indexOf(selectedOrder)].orderState, id).subscribe((data: any) => {
            this.applyFilters();
            this.snackBarService.openSnack(this.orderStateUpdateSuccessAlert, 5000, "green");
          },
          (error: any) => {
            this.applyFilters();
            this.snackBarService.openSnack(this.orderStateUpdateFailAlert, 5000, "red");
          });
        }, 1000);
      }
    }
    event.stopPropagation();
  }

  payBill(selectedOrder: any, event: any):void {
    if (confirm('Bestellung als bezahlt markieren?')) {
      this.orders[this.orders.indexOf(selectedOrder)].paymentState = 'paid';
      const str = JSON.stringify(this.orders[this.orders.indexOf(selectedOrder)]);
      const obj = JSON.parse(str);
      const id = obj.order.id;
      this.waiterCockpitService.updatePaymentState(this.orders[this.orders.indexOf(selectedOrder)].paymentState, id).subscribe((data: any) => {
        this.applyFilters();
        this.snackBarService.openSnack(this.paymentStateUpdateSuccessAlert, 5000, "green");
        this.billService.createBillAsPDF(selectedOrder);
      },
      (error: any) => {
        this.applyFilters();
        this.snackBarService.openSnack(this.paymentStateUpdateFailAlert, 5000, "red");
      });
    }
    event.stopPropagation();
  }

  animateOrderStateButton(button, currentColor: string, colorToUpdateTo: string): void {
    button.lastElementChild.innerText = '';
    button.firstElementChild.firstElementChild.innerText = 'refresh';
    button.firstElementChild.style.width = '150px';
    button.firstElementChild.style.backgroundColor = colorToUpdateTo;
    button.firstElementChild.animate([
      {width: '37.5px', backgroundColor: currentColor},
      {width: '150px', backgroundColor: colorToUpdateTo},
    ], 300);
    button.firstElementChild.firstElementChild.animate([
      {transform: 'rotateZ(0deg)', scale: '1'},
      {transform: 'rotateZ(90deg)', scale: '1'},
      {transform: 'rotateZ(180deg)', scale: '1'},
      {transform: 'rotateZ(270deg)', scale: '1'},
      {transform: 'rotateZ(360deg)', scale: '0.1'},
    ], 400);
    setTimeout(() => {
      button.firstElementChild.firstElementChild.innerText = 'check';
      button.firstElementChild.firstElementChild.style.opacity = '0';
      button.firstElementChild.firstElementChild.animate([
        {scale: '0.1', opacity: '1'},
        {scale: '1', opacity: '1'},
        {scale: '1.5', opacity: '1'},
        {scale: '2', opacity: '0.5'},
        {scale: '2', opacity: '0'},
      ], 600);
      setTimeout(() => {
        button.firstElementChild.style.width = '37.5px';
        button.firstElementChild.animate([
          {width: '150px'},
          {width: '37.5px'},
        ], 300);
      }, 300);
    }, 400);
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
