import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { State } from '../../store';
import { ConfigService } from '../../core/config/config.service';
import { WaiterCockpitService } from '../services/waiter-cockpit.service';
import { OrderCockpitComponent } from './order-cockpit.component';
import { config } from '../../core/config/config';
import {
  TestBed,
  ComponentFixture,
  async,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { TranslocoService } from '@ngneat/transloco';
import { of } from 'rxjs/internal/observable/of';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { getTranslocoModule } from '../../transloco-testing.module';
import { CoreModule } from '../../core/core.module';
import { DebugElement, EventEmitter } from '@angular/core';
import { By } from '@angular/platform-browser';
import { click } from '../../shared/common/test-utils';
import { ascSortOrder } from '../../../in-memory-test-data/db-order-asc-sort';
import { orderData } from '../../../in-memory-test-data/db-order';
import {BillService} from '../services/bill.service';
import {SnackBarService} from "../../core/snack-bar/snack-bar.service";

const mockDialog = {
  open: jasmine.createSpy('open').and.returnValue({
    afterClosed: () => of(true),
  }),
};

const mockSnackBarService = {
  open: jasmine.createSpy('openSnack').and.returnValue({
    afterClosed: () => of(true),
  }),
};

const translocoServiceStub = {
  selectTranslateObject: of({
    reservationDateH: 'Reservation Date',
    emailH: 'Email',
    bookingTokenH: 'Reference Number',
    ownerH: 'Owner',
    tableH: 'Table',
    creationDateH: 'Creation date',
    editH: 'Edit',
    paymentStateH: 'Payment state',
    orderStateH: 'Order state',
  } as any),
};

const waiterCockpitServiceStub = {
  getOrders: jasmine.createSpy('getOrders').and.returnValue(of(orderData)),
  ordersChanged: new EventEmitter<boolean>(),
  updateOrderState: jasmine.createSpy('updateOrderState').and.returnValue(of(orderData)),
  updatePaymentState: jasmine.createSpy('updatePaymentState').and.returnValue(of(orderData)),
};

const waiterCockpitServiceSortStub = {
  getOrders: jasmine.createSpy('getOrders').and.returnValue(of(ascSortOrder)),
  ordersChanged: new EventEmitter<boolean>()
};

class TestBedSetUp {
  static loadWaiterCockpitServiceStud(waiterCockpitStub: any): any {
    const initialState = { config };
    return TestBed.configureTestingModule({
      declarations: [OrderCockpitComponent],
      providers: [
        { provide: MatDialog, useValue: mockDialog },
        { provide: WaiterCockpitService, useValue: waiterCockpitStub },
        BillService,
        { provide: SnackBarService, useValue: mockSnackBarService },
        TranslocoService,
        ConfigService,
        provideMockStore({ initialState }),
      ],
      imports: [
        BrowserAnimationsModule,
        ReactiveFormsModule,
        getTranslocoModule(),
        CoreModule,
      ],
    });
  }
}

fdescribe('OrderCockpitComponent', () => {
  let component: OrderCockpitComponent;
  let fixture: ComponentFixture<OrderCockpitComponent>;
  let store: Store<State>;
  let initialState;
  let waiterCockpitService: WaiterCockpitService;
  let dialog: MatDialog;
  let translocoService: TranslocoService;
  let configService: ConfigService;
  let el: DebugElement;

  beforeEach(async(() => {
    initialState = { config };
    TestBedSetUp.loadWaiterCockpitServiceStud(waiterCockpitServiceStub)
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(OrderCockpitComponent);
        component = fixture.componentInstance;
        el = fixture.debugElement;
        store = TestBed.inject(Store);
        configService = new ConfigService(store);
        waiterCockpitService = TestBed.inject(WaiterCockpitService);
        dialog = TestBed.inject(MatDialog);
        translocoService = TestBed.inject(TranslocoService);
      });
  }));

  it('should create component and verify content and total records of orders', fakeAsync(() => {
    spyOn(translocoService, 'selectTranslateObject').and.returnValue(
      translocoServiceStub.selectTranslateObject,
    );
    fixture.detectChanges();
    tick();
    expect(component).toBeTruthy();
    expect(component.orders).toEqual(orderData.content);
    expect(component.totalOrders).toBe(8);
  }));

  it('should go to next page of orders', () => {
    component.page({
      pageSize: 100,
      pageIndex: 2,
      length: 50,
    });
    expect(component.orders).toEqual(orderData.content);
    expect(component.totalOrders).toBe(8);
  });

  it('should clear form and reset', fakeAsync(() => {
    const clearFilter = el.query(By.css('.orderClearFilters'));
    click(clearFilter);
    fixture.detectChanges();
    tick();
    expect(component.orders).toEqual(orderData.content);
    expect(component.totalOrders).toBe(8);
  }));

  it('should open OrderDialogComponent dialog on click of row', fakeAsync(() => {
    fixture.detectChanges();
    const clearFilter = el.queryAll(By.css('.mat-row'));
    click(clearFilter[0]);
    tick();
    expect(dialog.open).toHaveBeenCalled();
  }));

  it('should filter the order table on click of submit', fakeAsync(() => {
    fixture.detectChanges();
    const submit = el.query(By.css('.orderApplyFilters'));
    click(submit);
    tick();
    expect(component.orders).toEqual(orderData.content);
    expect(component.totalOrders).toBe(8);
  }));
});

fdescribe('TestingOrderCockpitComponentWithSortOrderData', () => {
  let component: OrderCockpitComponent;
  let fixture: ComponentFixture<OrderCockpitComponent>;
  let store: Store<State>;
  let initialState;
  let waiterCockpitService: WaiterCockpitService;
  let dialog: MatDialog;
  let translocoService: TranslocoService;
  let configService: ConfigService;
  let el: DebugElement;

  beforeEach(async(() => {
    initialState = { config };
    TestBedSetUp.loadWaiterCockpitServiceStud(waiterCockpitServiceSortStub)
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(OrderCockpitComponent);
        component = fixture.componentInstance;
        el = fixture.debugElement;
        store = TestBed.inject(Store);
        configService = new ConfigService(store);
        waiterCockpitService = TestBed.inject(WaiterCockpitService);
        dialog = TestBed.inject(MatDialog);
        translocoService = TestBed.inject(TranslocoService);
      });
  }));

  it('should sort records of orders', () => {
    component.sort({
      active: 'Reservation Date',
      direction: 'asc',
    });
    expect(component.orders).toEqual(ascSortOrder.content);
    expect(component.totalOrders).toBe(8);
  });

  it('should clear form and reset', fakeAsync(() => {
    const clearFilter = el.query(By.css('.orderClearFilters'));
    click(clearFilter);
    fixture.detectChanges();
    tick();
    expect(component.orders).toEqual(ascSortOrder.content);
    expect(component.totalOrders).toBe(8);
  }));
});

fdescribe('TestingOrderCockpitComponentImplementationsCTro', () => {
  let component: OrderCockpitComponent;
  let fixture: ComponentFixture<OrderCockpitComponent>;
  let store: Store<State>;
  let initialState;
  let waiterCockpitService: WaiterCockpitService;
  let dialog: MatDialog;
  let translocoService: TranslocoService;
  let configService: ConfigService;
  let el: DebugElement;

  beforeEach(async(() => {
    initialState = { config };
    TestBedSetUp.loadWaiterCockpitServiceStud(waiterCockpitServiceStub)
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(OrderCockpitComponent);
        component = fixture.componentInstance;
        el = fixture.debugElement;
        store = TestBed.inject(Store);
        configService = new ConfigService(store);
        waiterCockpitService = TestBed.inject(WaiterCockpitService);
        dialog = TestBed.inject(MatDialog);
        translocoService = TestBed.inject(TranslocoService);
      });
  }));

  it('should create', fakeAsync(() => {
    spyOn(translocoService, 'selectTranslateObject').and.returnValue(
      translocoServiceStub.selectTranslateObject,
    );
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(component.orders).toEqual(orderData.content);
    expect(component.totalOrders).toBe(8);
  }));

  it('should open OrderEditComponent on click', fakeAsync(() => {
    fixture.detectChanges();
    const orderRows = el.queryAll(By.css('.mat-row'));
    const editButton = orderRows[0].query(By.css('.orderEditButton'));
    click(editButton);
    tick();
    expect(dialog.open).toHaveBeenCalled();
  }));

  it('should call updatePaymentState of waiterCockpitService', fakeAsync(() => {
    fixture.detectChanges();
    const orderRows = el.queryAll(By.css('.mat-row'));
    const payButton = orderRows[0].query(By.css('.payOrderButton'));
    click(payButton);
    tick();
    expect(waiterCockpitService.updatePaymentState).toHaveBeenCalled();
  }));

  it('should call updateOrderState of waiterCockpitService', fakeAsync(() => {
    fixture.detectChanges();
    const orderRows = el.queryAll(By.css('.mat-row'));
    const stateButton = orderRows[0].query(By.css('.orderStateButton'));
    click(stateButton);
    tick();
    expect(waiterCockpitService.updateOrderState).toHaveBeenCalled();
  }));
});
