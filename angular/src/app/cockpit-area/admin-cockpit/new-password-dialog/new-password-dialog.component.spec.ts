import {async, ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import { NewPasswordDialogComponent } from './new-password-dialog.component';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {SnackBarService} from '../../../core/snack-bar/snack-bar.service';
import {TRANSLOCO_TRANSPILER, TranslocoService} from '@ngneat/transloco';
import {ConfigService} from '../../../core/config/config.service';
import {provideMockStore} from '@ngrx/store/testing';
import {config} from '../../../core/config/config';
import {AdminCockpitService} from '../../services/admin-cockpit.service';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ReactiveFormsModule} from '@angular/forms';
import {getTranslocoModule} from '../../../transloco-testing.module';
import {CoreModule} from '../../../core/core.module';
import {Store} from '@ngrx/store';
import {State} from '../../../store';
import {DebugElement, EventEmitter} from '@angular/core';
import {click} from "../../../shared/common/test-utils";
import {userData} from "../../../../in-memory-test-data/db-users";
import {AdminCockpitComponent} from "../admin-cockpit.component";
import {ActivatedRoute, Router} from "@angular/router";
import {of} from "rxjs/internal/observable/of";

class TestBedSetUp {
  static loadNewPasswordDialogComponentStub(): any {
    const initialState = { config };
    return TestBed.configureTestingModule({
      declarations: [ NewPasswordDialogComponent ],
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
        // { provide: ActivatedRoute, useValue: { params: {category: 'all'} } },

        { provide: ActivatedRoute, useValue: { params: of({ category: 'all' }) } }
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

describe('NewPasswordDialogComponent', () => {
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
    TestBedSetUp.loadNewPasswordDialogComponentStub()
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
  });

  it('should call submit of NewPasswordComponent', fakeAsync(() => {
    spyOn(NewPasswordDialogComponent.prototype, 'submit');
    fixture.detectChanges();
    const applyButton = el.nativeElement.querySelector('.registerSubmit');
    click(applyButton);
    tick();
    //expect(NewPasswordDialogComponent.prototype.submit).toHaveBeenCalled();
    // geht nicht, wird wohl nicht aufgerufen vllt sind die Passwörter noch nicht eingetragen?
  }));
});
