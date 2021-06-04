/*import { async, ComponentFixture, TestBed } from '@angular/core/testing';

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
import {DebugElement} from '@angular/core';

class TestBedSetUp {
  static loadAdminCockpitServiceStud(): any {
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
        { provide: MatDialogRef, useValue: {} }
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
  let dialog: MatDialog;
  let translocoService: TranslocoService;
  let configService: ConfigService;
  let el: DebugElement;

  beforeEach(async(() => {
    initialState = { config };
    TestBedSetUp.loadAdminCockpitServiceStud()
      .compileComponents()
      .then( () => {
        fixture = TestBed.createComponent(NewPasswordDialogComponent);
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
});*/
