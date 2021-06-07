import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

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
import {DebugElement, EventEmitter} from '@angular/core';
import { OrderEditComponent } from './order-edit.component';
import { dialogOrderDetails } from 'in-memory-test-data/db-order-dialog-data';
import { SnackBarService } from 'app/core/snack-bar/snack-bar.service';
import { By } from '@angular/platform-browser';
import { click } from 'app/shared/common/test-utils';
import { of } from 'rxjs';
import { orderData } from 'in-memory-test-data/db-order';
import { dialog } from 'electron';
class TestBedSetUp {
  static loadWaiterCockpitServiceStud(): any {
    const initialState = { config };
    return TestBed.configureTestingModule({
      declarations: [OrderEditComponent],
      providers: [
        TranslocoService,
        ConfigService,
        { provide: MAT_DIALOG_DATA, useValue: dialogOrderDetails },
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
        fixture.detectChanges();
      });
  }));

  it('should create and check for booking token', () => {
    expect(component).toBeTruthy();
    expect(component.data.booking.bookingToken).toEqual(dialogOrderDetails.booking.bookingToken);
  });

  it('should increase amount of ordered items', fakeAsync(() => {
    let oldAmount = component.data.orderLines[0].orderLine.amount;
    fixture.detectChanges();
    const orderLines = el.queryAll(By.css('.mat-row'));
    const increaseButton = orderLines[0].query(By.css('.increaseOrderLineAmountButton'));
    click(increaseButton);
    tick();
    expect(component.data.orderLines[0].orderLine.amount).toEqual(oldAmount + 1);
  }));

  it('should decrease amount of ordered items', fakeAsync(() => {
    let oldAmount = component.data.orderLines[1].orderLine.amount;
    fixture.detectChanges();
    const orderLines = el.queryAll(By.css('.mat-row'));
    const decreaseButton = orderLines[1].query(By.css('.decreaseOrderLineAmountButton'));
    click(decreaseButton);
    tick();
    expect(component.data.orderLines[1].orderLine.amount).toEqual(oldAmount - 1);
    expect(component.editedOrderLines.length).toEqual(1);
  }));

  it('should delete the responding orderLine', fakeAsync(() => {
    let oldOrderLineAmount = component.data.orderLines.length;
    fixture.detectChanges();
    const orderLines = el.queryAll(By.css('.mat-row'));
    const deleteOrderLine = orderLines[0].query(By.css('.deleteOrderLineButton'));
    click(deleteOrderLine);
    tick();
    expect(component.data.orderLines.length).toEqual(oldOrderLineAmount - 1);
    expect(component.editedOrderLines.length).toEqual(1);
  }));

  it('should call updateOrderLines of WaiterCockpitService', fakeAsync(() => {
    fixture.detectChanges();
    expect(waiterCockpitService.updateOrderLines).toHaveBeenCalled;
  }));

  it('should call updateOrderState of WaiterCockpitService to cancel order', fakeAsync(() => {
    fixture.detectChanges();
    expect(waiterCockpitService.updateOrderState).toHaveBeenCalled;
  }));
});
