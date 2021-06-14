import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { AdminCockpitComponent } from './admin-cockpit.component';
import {MatDialog} from "@angular/material/dialog";
import {config} from "../../core/config/config";
import {TranslocoService} from "@ngneat/transloco";
import {SnackBarService} from "../../core/snack-bar/snack-bar.service";
import {AdminCockpitService} from "../services/admin-cockpit.service";
import {ConfigService} from "../../core/config/config.service";
import {provideMockStore} from "@ngrx/store/testing";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {ReactiveFormsModule} from "@angular/forms";
import {getTranslocoModule} from "../../transloco-testing.module";
import {CoreModule} from "../../core/core.module";
import {Store} from "@ngrx/store";
import {State} from "../../store";
import {DebugElement, EventEmitter} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {of} from "rxjs/internal/observable/of";
import {userData} from "../../../in-memory-test-data/db-users";
import 'rxjs/add/observable/of';
import { Observable } from 'rxjs-compat';
import { AuthService } from 'app/core/authentication/auth.service';
import { By } from '@angular/platform-browser';
import { click } from 'app/shared/common/test-utils';

const adminCockpitServiceStub = {
  getUsers: jasmine.createSpy('getUsers').and.returnValue(of(userData)),
  usersChanged: new EventEmitter<boolean>(),
  deleteUser: jasmine.createSpy('deleteUser').and.returnValue(of(null)),
  sendPasswordResetEmail: jasmine.createSpy('sendPasswordResetEmail').and.returnValue(of(null)),
  emitUsersChanged: jasmine.createSpy('emitUsersChanged').and.returnValue(of(null)),
};

const authServiceStub = {
  getUser: jasmine.createSpy('getUser').and.returnValue(of('admin')),
};

const mockDialog = {
  open: jasmine.createSpy('open').and.returnValue({
    afterClosed: () => of(true),
  }),
};

  class TestBedSetUp {
  static loadAdminCockpitServiceStud(adminCockpitStub: any): any {
    const initialState = { config };
    return TestBed.configureTestingModule({
      declarations: [ AdminCockpitComponent ],
      providers: [
        TranslocoService,
        SnackBarService,
        { provide: MatDialog, useValue: mockDialog },
        { provide: AdminCockpitService, useValue: adminCockpitStub },
        { provide: AuthService, useValue: authServiceStub },
        ConfigService,
        provideMockStore({ initialState }),
        { provide: ActivatedRoute, useValue: { params: Observable.from([{category: 'all'}]) }},
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

describe('AdminCockpitComponent', () => {
  let component: AdminCockpitComponent;
  let fixture: ComponentFixture<AdminCockpitComponent>;
  let store: Store<State>;
  let initialState;
  let adminCockpitService: AdminCockpitService;
  let dialog: MatDialog;
  let translocoService: TranslocoService;
  let configService: ConfigService;
  let el: DebugElement;
  let activatedRoute: ActivatedRoute;

  beforeEach(async(() => {
    initialState = { config };
    TestBedSetUp.loadAdminCockpitServiceStud(adminCockpitServiceStub)
      .compileComponents()
      .then( () => {
        fixture = TestBed.createComponent(AdminCockpitComponent);
        component = fixture.componentInstance;
        el = fixture.debugElement;
        store = TestBed.inject(Store);
        configService = new ConfigService(store);
        adminCockpitService = TestBed.inject(AdminCockpitService);
        dialog = TestBed.inject(MatDialog);
        translocoService = TestBed.inject(TranslocoService);
        activatedRoute = TestBed.inject(ActivatedRoute);
        fixture.detectChanges();
      });
  }));

  it('should create and check for amount of loaded users', () => {
    expect(component).toBeTruthy();
    expect(component.users).toEqual(userData.content);
    expect(component.totalUsers).toBe(5);
  });

  it('schould open createUserDialog', fakeAsync(() => {
    const createUserButton = el.query(By.css('.createUserButton'));
    click(createUserButton);
    tick();
    expect(dialog.open).toHaveBeenCalled();
  }));

  it('should open newPasswordDialog', fakeAsync(() => {
    const userRows = el.queryAll(By.css('.mat-row'));
    const createUserButton = userRows[0].query(By.css('.resetPasswordButton'));
    click(createUserButton);
    tick();
    expect(dialog.open).toHaveBeenCalled();
  }));

  it('should call sendPasswordResetEmail of adminCockpitService', fakeAsync(() => {
    const userRows = el.queryAll(By.css('.mat-row'));
    const sendResetMailButton = userRows[0].query(By.css('.sendResetLinkButton'));
    click(sendResetMailButton);
    tick();
    expect(adminCockpitService.sendPasswordResetEmail).toHaveBeenCalled();
  }));

  it('should delete user', fakeAsync(() => {
    const userRows = el.queryAll(By.css('.mat-row'));
    const deleteUserButton = userRows[0].query(By.css('.deleteUserButton'));
    click(deleteUserButton);
    tick();
    expect(adminCockpitService.deleteUser).toHaveBeenCalled();
  }));
});
