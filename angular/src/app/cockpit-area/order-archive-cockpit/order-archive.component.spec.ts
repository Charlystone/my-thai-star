import { async, ComponentFixture, TestBed } from '@angular/core/testing';

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
import {orderData} from '../../../in-memory-test-data/db-order';
import {State} from '../../store';
import {DebugElement} from '@angular/core';

const mockDialog = {
  open: jasmine.createSpy('open').and.returnValue({
    afterClosed: () => of(true),
  }),
};

const waiterCockpitServiceStub = {
  getOrders: jasmine.createSpy('getOrders').and.returnValue(of(orderData)),
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

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
