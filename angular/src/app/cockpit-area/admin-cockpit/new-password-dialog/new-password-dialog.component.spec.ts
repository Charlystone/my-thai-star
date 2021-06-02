import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPasswordDialogComponent } from './new-password-dialog.component';
import {MatDialog} from "@angular/material/dialog";
import {WaiterCockpitService} from "../../services/waiter-cockpit.service";
import {BillService} from "../../services/bill.service";
import {SnackBarService} from "../../../core/snack-bar/snack-bar.service";
import {TRANSLOCO_TRANSPILER, TranslocoService} from "@ngneat/transloco";
import {ConfigService} from "../../../core/config/config.service";
import {provideMockStore} from "@ngrx/store/testing";
import {WindowService} from "../../../core/window/window.service";

describe('NewPasswordDialogComponent', () => {
  let component: NewPasswordDialogComponent;
  let fixture: ComponentFixture<NewPasswordDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewPasswordDialogComponent ],
      providers: [
        WindowService,
        TRANSLOCO_TRANSPILER
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewPasswordDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
