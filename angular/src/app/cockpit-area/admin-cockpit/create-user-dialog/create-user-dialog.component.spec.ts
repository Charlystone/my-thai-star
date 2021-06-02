import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUserDialogComponent } from './create-user-dialog.component';
import {TRANSLOCO_TRANSPILER, TranslocoService} from '@ngneat/transloco';
import {SnackBarService} from '../../../core/snack-bar/snack-bar.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Overlay} from '@angular/cdk/overlay';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {AdminCockpitService} from '../../services/admin-cockpit.service';
import {HttpClient, HttpHandler} from '@angular/common/http';
import {ActionsSubject, ReducerManager, ReducerManagerDispatcher, StateObservable, Store} from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import {DebugElement, InjectionToken} from '@angular/core';
import {state} from '@angular/animations';
import {ConfigService} from '../../../core/config/config.service';


describe('CreateUserDialogComponent', () => {
  let component: CreateUserDialogComponent;
  let fixture: ComponentFixture<CreateUserDialogComponent>;
  let store: MockStore;
  let initialState;
  let adminCockpitService: AdminCockpitService;
  let dialog: MatDialog;
  let translocoService: TranslocoService;
  let configService: ConfigService;
  let el: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateUserDialogComponent ],
      /* provide löst folgenden Fehler:
       Error: Invalid provider for the NgModule 'DynamicTestModule' - only instances of Provider and Type are allowed,
       got: [..., ..., ?InjectionToken TRANSLOCO_TRANSPILER?]
       */
      providers: [
        { provide: TranslocoService, useValue: TRANSLOCO_TRANSPILER },
        SnackBarService,
        MatSnackBar,
        Overlay,
        { provide: MatDialogRef, useValue: [] },
        AdminCockpitService,
        HttpClient,
        HttpHandler,
        Store,
        StateObservable,
        ActionsSubject,
        ReducerManager,
        ReducerManagerDispatcher,
        MockStore,
        provideMockStore({ initialState: state }),
        { provide: InjectionToken, useValue: [] },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    TestBed.configureTestingModule(null)
      .compileComponents()
      .then( () => {
        fixture = TestBed.createComponent(CreateUserDialogComponent);
        component = fixture.componentInstance;
        el = fixture.debugElement;
        store = TestBed.inject(MockStore);
        adminCockpitService = TestBed.inject(AdminCockpitService);
        dialog = TestBed.inject(MatDialog);
        translocoService = TestBed.inject(TranslocoService);
      });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
