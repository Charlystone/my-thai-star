import {async, ComponentFixture, TestBed, tick} from '@angular/core/testing';

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
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Store } from '@ngrx/store';
import {click} from "../../../shared/common/test-utils";
import {NewPasswordDialogComponent} from "../new-password-dialog/new-password-dialog.component";
class TestBedSetUp {
  static loadAdminCockpitServiceStud(): any {
    const initialState = { config };
    return TestBed.configureTestingModule({
      declarations: [ CreateUserDialogComponent ],
      providers: [
        TranslocoService,
        SnackBarService,
        MatDialog,
        AdminCockpitService,
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

fdescribe('CreateUserDialogComponent', () => {
  let component: CreateUserDialogComponent;
  let fixture: ComponentFixture<CreateUserDialogComponent>;
  let store: Store<State>;
  let initialState;
  let adminCockpitService: AdminCockpitService;
  let dialog: MatDialog;
  let translocoService: TranslocoService;
  let configService: ConfigService;
  let el: DebugElement;

  beforeEach(async(() => {
    initialState = { config };
    TestBedSetUp.loadAdminCockpitServiceStud()
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
      });
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call submit of CreateUserDialogComponent', () => {
    spyOn(CreateUserDialogComponent.prototype, 'submit');
    fixture.detectChanges();
    const saveButton = el.nativeElement.querySelector('.saveButton');
    click(saveButton);
    tick();
    expect(CreateUserDialogComponent.prototype.submit).toHaveBeenCalled();
    });
});
