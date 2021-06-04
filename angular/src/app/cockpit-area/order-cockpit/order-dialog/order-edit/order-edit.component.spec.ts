import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import {config} from '../../../../core/config/config';
import {Store} from '@ngrx/store';
import {ConfigService} from '../../../../core/config/config.service';
import {WaiterCockpitService} from '../../../services/waiter-cockpit.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {TranslocoService} from '@ngneat/transloco';
import {provideMockStore} from '@ngrx/store/testing';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ReactiveFormsModule} from '@angular/forms';
import {getTranslocoModule} from '../../../../transloco-testing.module';
import {CoreModule} from '../../../../core/core.module';
import {State} from '../../../../store';
import {DebugElement} from '@angular/core';
import { OrderEditComponent } from './order-edit.component';
import { dialogOrderDetails } from 'in-memory-test-data/db-order-dialog-data';
import { SnackBarService } from 'app/core/snack-bar/snack-bar.service';

const mockDialogRef = {
  close: jasmine.createSpy('close'),
};
class TestBedSetUp {
  static loadWaiterCockpitServiceStud(): any {
    const initialState = { config };
    return TestBed.configureTestingModule({
      declarations: [OrderEditComponent],
      providers: [
        TranslocoService,
        ConfigService,
        { provide: MAT_DIALOG_DATA, useValue: dialogOrderDetails },
        { provide: MatDialogRef, useValue: mockDialogRef },
        WaiterCockpitService,
        SnackBarService,
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

describe('OrderEditComponent', () => {
  let component: OrderEditComponent;
  let fixture: ComponentFixture<OrderEditComponent>;
  let initialState;
  let translocoService: TranslocoService;
  let el: DebugElement;
  let waiterCockpitService: WaiterCockpitService;
  let snackBarService: SnackBarService;
  let store: Store<State>;
  let configService: ConfigService;

  beforeEach(async(() => {
    initialState = {config};
    TestBedSetUp.loadWaiterCockpitServiceStud()
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(OrderEditComponent);
        component = fixture.componentInstance;
        el = fixture.debugElement;
        translocoService = TestBed.inject(TranslocoService);
        waiterCockpitService = TestBed.inject(WaiterCockpitService);
        snackBarService = TestBed.inject(SnackBarService);
        store = TestBed.inject(Store);
        configService = new ConfigService(store);
      });
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.data.booking.bookingToken).toEqual(dialogOrderDetails.booking.bookingToken);
  });
});
