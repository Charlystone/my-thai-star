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
import { config } from '../../../core/config/config';
import { CoreModule } from 'app/core/core.module';
import { getTranslocoModule } from 'app/transloco-testing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


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

  class TestBedSetUp {
    static loadAdminCockpitServiceStud(adminCockpitStub: any): any {
      const initialState = { config };
      return TestBed.configureTestingModule({
        declarations: [ CreateUserDialogComponent ],
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

  beforeEach(() => {
    TestBedSetUp.loadAdminCockpitServiceStud(null)
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
