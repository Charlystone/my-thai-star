import {async, ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import { CreateUserDialogComponent } from './create-user-dialog.component';
import {TranslocoService} from '@ngneat/transloco';
import {SnackBarService} from '../../../core/snack-bar/snack-bar.service';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {AdminCockpitService} from '../../services/admin-cockpit.service';
import { State } from '../../../store';
import {  provideMockStore } from '@ngrx/store/testing';
import {DebugElement} from '@angular/core';
import {ConfigService} from '../../../core/config/config.service';
import { config } from '../../../core/config/config';
import { CoreModule } from 'app/core/core.module';
import { getTranslocoModule } from 'app/transloco-testing.module';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Store } from '@ngrx/store';
import {click} from "../../../shared/common/test-utils";
import { By } from '@angular/platform-browser';
import { of } from 'rxjs/internal/observable/of';

const adminCockpitServiceStub = {
  getUserByName: jasmine.createSpy('getUserByName').and.returnValue(of(null)),
  updateUser: jasmine.createSpy('updateUser').and.returnValue(of(null)),
  emitUsersChanged: jasmine.createSpy('emitUsersChanged').and.returnValue(of(null)),
};
class TestBedSetUp {
  static loadAdminCockpitServiceStud(adminCockpitStub: any): any {
    const initialState = { config };
    return TestBed.configureTestingModule({
      declarations: [ CreateUserDialogComponent ],
      providers: [
        TranslocoService,
        SnackBarService,
        { provide: AdminCockpitService, useValue: adminCockpitStub },
        ConfigService,
        provideMockStore({ initialState }),
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

describe('CreateUserDialogComponent', () => {
  let component: CreateUserDialogComponent;
  let fixture: ComponentFixture<CreateUserDialogComponent>;
  let store: Store<State>;
  let initialState;
  let adminCockpitService: AdminCockpitService;
  let dialog: MatDialog;
  let translocoService: TranslocoService;
  let configService: ConfigService;
  let el: DebugElement;
  const REGEXP_EMAIL = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

  beforeEach(async(() => {
    initialState = { config };
    TestBedSetUp.loadAdminCockpitServiceStud(adminCockpitServiceStub)
      .compileComponents()
      .then( () => {
        fixture = TestBed.createComponent(CreateUserDialogComponent);
        component = fixture.componentInstance;
        el = fixture.debugElement;
        store = TestBed.inject(Store);
        configService = new ConfigService(store);
        adminCockpitService = TestBed.inject(AdminCockpitService);
        dialog = TestBed.inject(MatDialog);
        translocoService = TestBed.inject(TranslocoService);
        fixture.detectChanges();
      });
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('check for disabled submit button with distinct passwords', fakeAsync(() => {
    component.createForm = new FormGroup({
      password: new FormControl('password', Validators.required),
      confirmPassword: new FormControl('Password123', Validators.required),
    });

    fixture.detectChanges();
    const submitButton = el.query(By.css('.saveButton'));
    expect(submitButton.nativeElement).toHaveClass('mat-button-disabled');
  }));

  it('should submit form and call updateUser of AdminCockpitService', fakeAsync(() => {
    component.createForm = new FormGroup({
      username: new FormControl('user0', Validators.required),
      email: new FormControl('user0@mail.com', [
        Validators.required,
        Validators.pattern(REGEXP_EMAIL),
      ]),
      password: new FormControl('password', Validators.required),
      role: new FormControl('Customer', Validators.required),
      confirmPassword: new FormControl('password', Validators.required),
    });
    
    fixture.detectChanges();
    const saveButton = el.query(By.css('.saveButton'));
    click(saveButton);
    tick();
    expect(adminCockpitService.updateUser).toHaveBeenCalled();
  }));
});
