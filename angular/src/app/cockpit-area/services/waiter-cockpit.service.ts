import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable, OnInit } from '@angular/core';
import {
  FilterCockpit,
  Pageable,
  Sort,
} from 'app/shared/backend-models/interfaces';
import { cloneDeep, map } from 'lodash';
import { Observable } from 'rxjs';
import { exhaustMap } from 'rxjs/operators';
import { ConfigService } from '../../core/config/config.service';
import {
  BookingResponse,
  OrderResponse,
  OrderView,
  OrderViewResult,
} from '../../shared/view-models/interfaces';
import { PriceCalculatorService } from '../../sidenav/services/price-calculator.service';
import { SnackBarService } from 'app/core/snack-bar/snack-bar.service';
import { TranslocoService } from '@ngneat/transloco';

@Injectable()
export class WaiterCockpitService {
  private readonly getReservationsRestPath: string =
    'bookingmanagement/v1/booking/search';
  private readonly getOrdersRestPath: string =
    'ordermanagement/v1/order/search';
  private readonly filterOrdersRestPath: string =
    'ordermanagement/v1/order/search';
  private readonly orderUpdateState: string =
    'ordermanagement/v1/order/orderstatus/';
  private readonly orderUpdate: string =
    'ordermanagement/v1/order/updateorder/';
  private readonly orderPaymentState: string =
    'ordermanagement/v1/order/paymentstate/';
  private readonly orderLine: string =
    'ordermanagement/v1/orderline/';
  private readonly restServiceRoot$: Observable<
    string
  > = this.config.getRestServiceRoot();

  updateSuccessAlert: string;
  updateFailAlert: string;
  ordersChanged = new EventEmitter<boolean>();

  constructor(
    private http: HttpClient,
    private priceCalculator: PriceCalculatorService,
    private snackBarService: SnackBarService,
    private config: ConfigService,
    private translocoService: TranslocoService,
  ) {
    this.translocoService.langChanges$.subscribe((event: any) => {
      this.setAlerts(event);
    });
  }

  setAlerts(lang: string): void {
      this.translocoService
      .selectTranslateObject('alerts.waiterCockpitAlerts', {}, lang)
      .subscribe((alertsWaiterCockpitAlerts) => {
        this.updateSuccessAlert = alertsWaiterCockpitAlerts.updateOrderLineSuccess;
        this.updateFailAlert = alertsWaiterCockpitAlerts.updateOrderLineFail;
      });
  }

  getOrders(
    pageable: Pageable,
    sorting: Sort[],
    filters: FilterCockpit,
  ): Observable<OrderResponse[]> {
    let path: string;
    filters.pageable = pageable;
    filters.pageable.sort = sorting;
    if (filters.email || filters.bookingToken) {
      path = this.filterOrdersRestPath;
    } else {
      delete filters.email;
      delete filters.bookingToken;
      path = this.getOrdersRestPath;
    }
    return this.restServiceRoot$.pipe(
      exhaustMap((restServiceRoot) =>
        this.http.post<OrderResponse[]>(`${restServiceRoot}${path}`, filters),
      ),
    );
  }

  getReservations(
    pageable: Pageable,
    sorting: Sort[],
    filters: FilterCockpit,
  ): Observable<BookingResponse[]> {
    filters.pageable = pageable;
    filters.pageable.sort = sorting;
    return this.restServiceRoot$.pipe(
      exhaustMap((restServiceRoot) =>
        this.http.post<BookingResponse[]>(
          `${restServiceRoot}${this.getReservationsRestPath}`,
          filters,
        ),
      ),
    );
  }

  orderComposer(orderList: OrderView[]): OrderView[] {
    const orders: OrderView[] = cloneDeep(orderList);
    map(orders, (o: OrderViewResult) => {
      o.dish.price = this.priceCalculator.getPrice(o);
      o.extras = map(o.extras, 'name').join(', ');
    });
    return orders;
  }

  getTotalPrice(orderLines: OrderView[]): number {
    return this.priceCalculator.getTotalPrice(orderLines);
  }

  emitOrdersChanged() {
    this.ordersChanged.emit(true);
  }

  updateOrderState(orderState: string, orderId: number): Observable<OrderResponse[]> {
    let payload;
    if(orderState == 'canceled') {
      payload = {
        orderState : orderState,
        paymentState: 'canceled'
      }
    } else {
      payload = {
        orderState : orderState
      }
    }
    return this.restServiceRoot$.pipe(
      exhaustMap((restServiceRoot) =>
        this.http.post<OrderResponse[]>(`${restServiceRoot}${this.orderUpdateState}` + orderId + `/`, payload),
      ),
    );
  }

  updatePaymentState(paymentState: string, orderId: number): Observable<OrderResponse[]> {
    const payload = {
      paymentState : paymentState
    }
    return this.restServiceRoot$.pipe(
      exhaustMap((restServiceRoot) =>
        this.http.post<OrderResponse[]>(`${restServiceRoot}${this.orderPaymentState}` + orderId + `/`, payload),
      ),
    );
  }

  updateOrderLines(orderLines: any[]) {
    this.updateOrderLine(orderLines, 0);
  }

  private updateOrderLine(orderLines: any[], orderLineIndex: number) {
    if (orderLines[orderLineIndex].deleted == true && orderLineIndex < orderLines.length - 1) { // delete
      this.deleteOrderLine(orderLines[orderLineIndex].orderLine.id).subscribe((data: any) => {
        return this.updateOrderLine(orderLines, ++orderLineIndex);
      });
    }
    if (orderLines[orderLineIndex].deleted == false && orderLineIndex < orderLines.length - 1) { // update
      this.updateOrderLineAmount(orderLines[orderLineIndex].orderLine).subscribe((data: any) => {
        return this.updateOrderLine(orderLines, ++orderLineIndex);
      });
    }
    if (orderLines[orderLineIndex].deleted == true && orderLineIndex == orderLines.length - 1) { // last orderLine and delete
      this.deleteOrderLine(orderLines[orderLineIndex].orderLine.id).subscribe((data: any) => {
        this.snackBarService.openSnack(this.updateSuccessAlert, 5000, "green");
        this.ordersChanged.emit(true);
      });;
    }
    if (orderLines[orderLineIndex].deleted == false && orderLineIndex == orderLines.length - 1) { // last orderLine and update
      this.updateOrderLineAmount(orderLines[orderLineIndex].orderLine).subscribe((data: any) => {
        this.snackBarService.openSnack(this.updateSuccessAlert, 5000, "green");
        this.ordersChanged.emit(true);
      });;
    }
  }

  private updateOrderLineAmount(orderLine: any): Observable<OrderResponse[]> {
    return this.restServiceRoot$.pipe(
      exhaustMap((restServiceRoot) =>
        this.http.post<OrderResponse[]>(`${restServiceRoot}${this.orderLine}`, orderLine),
      ),
    );
  }

  private deleteOrderLine(orderLineId: number): Observable<OrderResponse[]> {
    return this.restServiceRoot$.pipe(
      exhaustMap((restServiceRoot) =>
        this.http.delete<OrderResponse[]>(`${restServiceRoot}${this.orderLine}` + orderLineId + `/`),
      ),
    );
  }
}
