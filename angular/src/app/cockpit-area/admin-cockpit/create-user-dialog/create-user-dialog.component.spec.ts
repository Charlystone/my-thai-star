import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUserDialogComponent } from './create-user-dialog.component';
import {TRANSLOCO_TRANSPILER, TranslocoService} from '@ngneat/transloco';
import {SnackBarService} from '../../../core/snack-bar/snack-bar.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Overlay} from '@angular/cdk/overlay';
import {MatDialogRef} from '@angular/material/dialog';
import {AdminCockpitService} from '../../services/admin-cockpit.service';
import {HttpClient, HttpHandler} from '@angular/common/http';
import {ActionsSubject, ReducerManager, ReducerManagerDispatcher, StateObservable, Store} from "@ngrx/store";
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import {InjectionToken} from "@angular/core";


describe('CreateUserDialogComponent', () => {
  let component: CreateUserDialogComponent;
  let fixture: ComponentFixture<CreateUserDialogComponent>;

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
        provideMockStore,
        InjectionToken,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateUserDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
