import {async, ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import { NewPasswordDialogComponent } from './new-password-dialog.component';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {SnackBarService} from '../../../core/snack-bar/snack-bar.service';
import {TranslocoService} from '@ngneat/transloco';
import {ConfigService} from '../../../core/config/config.service';
import {provideMockStore} from '@ngrx/store/testing';
import {config} from '../../../core/config/config';
import {AdminCockpitService} from '../../services/admin-cockpit.service';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {getTranslocoModule} from '../../../transloco-testing.module';
import {CoreModule} from '../../../core/core.module';
import {Store} from '@ngrx/store';
import {State} from '../../../store';
import {DebugElement} from '@angular/core';
import {click} from "../../../shared/common/test-utils";
import { By } from '@angular/platform-browser';
import { UserDetailsTestData } from 'in-memory-test-data/db-user-details-test-data';
class TestBedSetUp {
  static loadNewPasswordDialogComponentStub(): any {
    const initialState = { config };
    return TestBed.configureTestingModule({
      declarations: [ NewPasswordDialogComponent ],
      providers: [
        TranslocoService,
        SnackBarService,
        AdminCockpitService,
        ConfigService,
        provideMockStore({ initialState }),
        { provide: MAT_DIALOG_DATA, useValue: UserDetailsTestData.userAreaServiceData },
        { provide: MatDialogRef, useValue: [] },
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
  let component: NewPasswordDialogComponent;
  let fixture: ComponentFixture<NewPasswordDialogComponent>;
  let store: Store<State>;
  let initialState;
  let adminCockpitService: AdminCockpitService;
  let translocoService: TranslocoService;
  let configService: ConfigService;
  let el: DebugElement;
  let snackBarService: SnackBarService;
  let dialog: MatDialog;

  const REGEXP_EMAIL = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

  beforeEach(async(() => {
    initialState = { config };
    TestBedSetUp.loadNewPasswordDialogComponentStub()
      .compileComponents()
      .then( () => {
        dialog = TestBed.inject(MatDialog);
        fixture = TestBed.createComponent(NewPasswordDialogComponent);
        component = fixture.componentInstance;
        el = fixture.debugElement;
        store = TestBed.inject(Store);
        configService = new ConfigService(store);
        adminCockpitService = TestBed.inject(AdminCockpitService);
        translocoService = TestBed.inject(TranslocoService);
        snackBarService = TestBed.inject(SnackBarService);
        fixture.detectChanges();
      });
  }));

  it('should create and check for username', () => {
    expect(component).toBeTruthy();
    expect(component.data.username).toEqual(UserDetailsTestData.userAreaServiceData.username);
  });

  it('check for disabled submit button with distinct passwords', fakeAsync(() => {
    component.createForm = new FormGroup({
      password: new FormControl('password', Validators.required),
      confirmPassword: new FormControl('Password123', Validators.required),
    });

    fixture.detectChanges();
    const submitButton = el.query(By.css('.registerSubmit'));
    expect(submitButton.nativeElement).toHaveClass('mat-button-disabled');
  }));

  it('should submit form and call updateUser of AdminCockpitService', fakeAsync(() => {
    spyOn(AdminCockpitService.prototype, 'updateUser');

    component.createForm = new FormGroup({
      password: new FormControl('password', Validators.required),
      confirmPassword: new FormControl('password', Validators.required),
    });

    fixture.detectChanges();
    const submitButton = el.query(By.css('.registerSubmit'));
    click(submitButton);
    tick();
    expect(AdminCockpitService.prototype.updateUser).toHaveBeenCalled();
  }));
});
