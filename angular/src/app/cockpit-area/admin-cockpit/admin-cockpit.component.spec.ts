import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { State } from '../../store';
import { ConfigService } from '../../core/config/config.service';
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
import {DebugElement, EventEmitter, NgModuleFactoryLoader} from '@angular/core';
import { By } from '@angular/platform-browser';
import { click } from '../../shared/common/test-utils';
import {userData} from '../../../in-memory-test-data/db-users';
import {BillService} from '../services/bill.service';
import {SnackBarService} from '../../core/snack-bar/snack-bar.service';
import {AdminCockpitComponent} from './admin-cockpit.component';
import {AdminCockpitService} from '../services/admin-cockpit.service';
import {ChildrenOutletContexts, Router, UrlSerializer} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';

const mockDialog = {
  open: jasmine.createSpy('open').and.returnValue({
    afterClosed: () => of(true),
  }),
};

const mockSnackBarService = {
  openSnack: jasmine.createSpy('openSnack').and.returnValue(of(true))
};

const mockBillService = {
  createBillAsPDF: jasmine.createSpy('createBillAsPDF').and.returnValue(of(true))
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

const adminCockpitServiceStub = {
  getUsers: jasmine.createSpy('getUsers').and.returnValue(of(userData)),
  usersChanged: new EventEmitter<boolean>(),
  sendEmailForPasswordReset: jasmine.createSpy('sendEmailForPasswordReset'),
};

class TestBedSetUp {
  static loadAdminCockpitServiceStud(AdminCockpitStub: any): any {
    const initialState = { config };
    return TestBed.configureTestingModule({
      declarations: [AdminCockpitComponent],
      providers: [
        { provide: AdminCockpitService, useValue: AdminCockpitStub },
        { provide: MatDialog, useValue: mockDialog },
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
        RouterTestingModule,
      ],
    });
  }
}

fdescribe('AdminCockpitComponent', () => {
  let component: AdminCockpitComponent;
  let fixture: ComponentFixture<AdminCockpitComponent>;
  let store: Store<State>;
  let initialState;
  let adminCockpitService: AdminCockpitService;
  let dialog: MatDialog;
  let translocoService: TranslocoService;
  let configService: ConfigService;
  let el: DebugElement;

  beforeEach(async(() => {
    initialState = { config };
    TestBedSetUp.loadAdminCockpitServiceStud(adminCockpitServiceStub)
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(AdminCockpitComponent);
        component = fixture.componentInstance;
        el = fixture.debugElement;
        store = TestBed.inject(Store);
        configService = new ConfigService(store);
        adminCockpitService = TestBed.inject(AdminCockpitService);
        dialog = TestBed.inject(MatDialog);
        translocoService = TestBed.inject(TranslocoService);
      });
  }));

  it('should create', fakeAsync(() => {
    spyOn(translocoService, 'selectTranslateObject').and.returnValue(
      translocoServiceStub.selectTranslateObject,
    );
    fixture.detectChanges();
    tick();
    expect(component).toBeTruthy();
    expect(component.users).toEqual(userData.content);
    expect(component.totalUsers).toBe(6);
  }));

  /*it('should open NewPassword on click', fakeAsync(() => {
    fixture.detectChanges();
    const userRows = el.queryAll(By.css('.mat-row'));
    const resetButton = userRows[0].query(By.css('.resetPasswordButton'));
    click(resetButton);
    tick();
    expect(dialog.open).toHaveBeenCalled();
  }));

  it('should delete the responding userLine', fakeAsync(() => {
    const oldUserLineAmount = component.data.userLines.length;
    fixture.detectChanges();
    const userLines = el.queryAll(By.css('.mat-row'));
    const deleteUserLine = userLines[0].query(By.css('.deleteUserLineButton'));
    click(deleteUserLine);
    tick();
    expect(component.data.userLines.length).toEqual(oldUserLineAmount - 1);
}));

  it('should open CreateUser on click', fakeAsync(() => {
    fixture.detectChanges();
    const userRows = el.queryAll(By.css('.mat-row'));
    const resetButton = userRows[0].query(By.css('.createUserButton'));
    click(resetButton);
    tick();
    expect(dialog.open).toHaveBeenCalled();
  }));

  it('should call sendEmailForPasswordReset of AdminCockpitComponent', fakeAsync(() => {
    fixture.detectChanges();
    const orderRows = el.queryAll(By.css('.mat-row'));
    const resetButton = orderRows[0].query(By.css('.sendResetLinkButton'));
    click(resetButton);
    tick();
    expect(adminCockpitComponent.sendEmailForPasswordReset).toHaveBeenCalled();
  }));

  it('should filter Customers out of all Users', fakeAsync(() => {
    fixture.detectChanges();
    const filterButtonCustomers = el.query(By.css('.filterCostumers'));
    click(filterButtonCustomers);
    tick();
    expect(component.totalUsers).toBe(1);
  }));

  it('should filter Waiters out of all Users', fakeAsync(() => {
    fixture.detectChanges();
    const filterButtonWaiters = el.query(By.css('.filterWaiters'));
    click(filterButtonWaiters);
    tick();
    expect(component.totalUsers).toBe(1);
  }));

  it('should filter Managers out of all Users', fakeAsync(() => {
    fixture.detectChanges();
    const filterButtonManagers = el.query(By.css('.filterManagers'));
    click(filterButtonManagers);
    tick();
    expect(component.totalUsers).toBe(3);
  }));

  it('should filter Admins out of all Users', fakeAsync(() => {
    fixture.detectChanges();
    const filterButtonAdmins = el.query(By.css('.filterAdmins'));
    click(filterButtonAdmins);
    tick();
    expect(component.totalUsers).toBe(1);
  }));*/
});
