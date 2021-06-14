import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCockpitComponent } from './admin-cockpit.component';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
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

const adminCockpitServiceStub = {
  getUsers: jasmine.createSpy('getUsers').and.returnValue(of(userData)),
  usersChanged: new EventEmitter<boolean>(),
};

  class TestBedSetUp {
  static loadAdminCockpitServiceStud(adminCockpitStub: any): any {
    const initialState = { config };
    return TestBed.configureTestingModule({
      declarations: [ AdminCockpitComponent ],
      providers: [
        TranslocoService,
        SnackBarService,
        MatDialog,
        { provide: AdminCockpitService, useValue: adminCockpitStub },
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
      });
  }));

  it('should create and check for amount of loaded users', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(component.users).toEqual(userData.content);
    expect(component.totalUsers).toBe(6);
  });
});
