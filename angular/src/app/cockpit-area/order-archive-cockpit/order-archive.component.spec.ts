import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { OrderArchiveComponent } from './order-archive.component';
import {config} from '../../core/config/config';
import {Store} from '@ngrx/store';
import {ConfigService} from '../../core/config/config.service';
import {WaiterCockpitService} from '../services/waiter-cockpit.service';
import {MatDialog} from '@angular/material/dialog';
import {TranslocoService} from '@ngneat/transloco';
import {provideMockStore} from '@ngrx/store/testing';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ReactiveFormsModule} from '@angular/forms';
import {getTranslocoModule} from '../../transloco-testing.module';
import {CoreModule} from '../../core/core.module';
import {of} from 'rxjs/internal/observable/of';
import {orderArchiveData} from '../../../in-memory-test-data/db-order-archive';
import {ascSortOrderArchive} from '../../../in-memory-test-data/db-order-archive-asc-sort';
import {State} from '../../store';
import {DebugElement} from '@angular/core';
import { click } from 'app/shared/common/test-utils';
import { By } from '@angular/platform-browser';

const mockDialog = {
  open: jasmine.createSpy('open').and.returnValue({
    afterClosed: () => of(true),
  }),
};

const waiterCockpitServiceStub = {
  getOrders: jasmine.createSpy('getOrders').and.returnValue(of(orderArchiveData)),
};

const waiterCockpitServiceSortStub = {
  getOrders: jasmine.createSpy('getOrders').and.returnValue(of(ascSortOrderArchive)),
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
class TestBedSetUp {
  static loadWaiterCockpitServiceStud(waiterCockpitStub: any): any {
    const initialState = { config };
    return TestBed.configureTestingModule({
      declarations: [OrderArchiveComponent],
      providers: [
        { provide: MatDialog, useValue: mockDialog },
        { provide: WaiterCockpitService, useValue: waiterCockpitStub },
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

fdescribe('OrderArchiveComponent', () => {
  let component: OrderArchiveComponent;
  let fixture: ComponentFixture<OrderArchiveComponent>;
  let store: Store<State>;
  let initialState;
  let waiterCockpitService: WaiterCockpitService;
  let translocoService: TranslocoService;
  let configService: ConfigService;
  let el: DebugElement;
  let dialog: MatDialog;

  beforeEach(async(() => {
    initialState = {config};
    TestBedSetUp.loadWaiterCockpitServiceStud(waiterCockpitServiceStub)
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(OrderArchiveComponent);
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
    expect(component).toBeTruthy();
    expect(component.orders).toEqual(orderArchiveData.content);
    expect(component.totalOrders).toBe(8);
  }));

  it('should go to next page of orders', () => {
    component.page({
      pageSize: 100,
      pageIndex: 2,
      length: 50,
    });
    expect(component.orders).toEqual(orderArchiveData.content);
    expect(component.totalOrders).toBe(8);
  });

  it('should clear form and reset', fakeAsync(() => {
    const clearFilter = el.query(By.css('.orderClearFilters'));
    click(clearFilter);
    fixture.detectChanges();
    tick();
    expect(component.orders).toEqual(orderArchiveData.content);
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
    expect(component.orders).toEqual(orderArchiveData.content);
    expect(component.totalOrders).toBe(8);
  }));
});

fdescribe('TestingOrderArchiveCockpitComponentWithSortOrderData', () => {
  let component: OrderArchiveComponent;
  let fixture: ComponentFixture<OrderArchiveComponent>;
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
        fixture = TestBed.createComponent(OrderArchiveComponent);
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
    expect(component.orders).toEqual(ascSortOrderArchive.content);
    expect(component.totalOrders).toBe(8);
  });

  it('should clear form and reset', fakeAsync(() => {
    const clearFilter = el.query(By.css('.orderClearFilters'));
    click(clearFilter);
    fixture.detectChanges();
    tick();
    expect(component.orders).toEqual(ascSortOrderArchive.content);
    expect(component.totalOrders).toBe(8);
  }));
});
