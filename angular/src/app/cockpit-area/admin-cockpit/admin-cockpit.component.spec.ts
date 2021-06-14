import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCockpitComponent } from './admin-cockpit.component';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {Overlay} from "@angular/cdk/overlay";
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
import {DebugElement, NgModuleFactoryLoader} from "@angular/core";
import {ActivatedRoute, ChildrenOutletContexts, Router, UrlSerializer} from "@angular/router";
import {of} from "rxjs/internal/observable/of";
import {orderData} from "../../../in-memory-test-data/db-order";
import {userData} from "../../../in-memory-test-data/db-users";
import {Observable} from "rxjs";
import 'rxjs/add/observable/of';

const adminCockpitServiceStub = {
  loadUsers: jasmine.createSpy('loadUsers').and.returnValue(of(userData)),
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
        AdminCockpitService,
        ConfigService,
        provideMockStore({ initialState }),
        { provide: MatDialogRef, useValue: [] },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} },
        { provide: ActivatedRoute, useValue: { params: {category: 'all'} } },
        //TypeError: this.activatedRoute.params.subscribe is not a function


    //{ provide: ActivatedRoute, useValue: { params: of({ category: 'all' }) } }
        //error properties: Object({ longStack: 'TypeError: Cannot read property 'loaded' of undefined
        // Das Problem ist, dass die Property zu dem eitpunkt des Access NOCH nicht existiert.

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
      });
  }));

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(component.users).toEqual(userData.content);
    expect(component.totalUsers).toBe(6);
  });
});
