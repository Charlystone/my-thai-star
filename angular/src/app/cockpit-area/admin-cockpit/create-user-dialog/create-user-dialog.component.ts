import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialogRef } from '@angular/material/dialog';
import { UserInfo} from '../../../shared/backend-models/interfaces';
import { last } from 'lodash';
import * as moment from 'moment';
import { SnackBarService } from 'app/core/snack-bar/snack-bar.service';
import { emailValidator } from '../../../shared/directives/email-validator.directive';
import { TranslocoService } from '@ngneat/transloco';
import { AdminCockpitService } from 'app/cockpit-area/services/admin-cockpit.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-create-user-dialog',
  templateUrl: './create-user-dialog.component.html',
  styleUrls: ['./create-user-dialog.component.scss']
})

export class CreateUserDialogComponent implements OnInit, OnDestroy {
  private translocoSubscription = Subscription.EMPTY;
  CreateModel: string[] = [];
  minDate: Date = new Date();
  bookForm: FormGroup;
  createForm: FormGroup;
  selected: string;
  REGEXP_EMAIL = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

  userInfo: UserInfo = {
    userName: '',
    email: '',
    password: '',
    role: '',
    confirmPassword: ''
  };

  userCreationSuccessAltert: string;
  usernameNotAvailableAlert: string;

  constructor(
    private translocoService: TranslocoService,
    private snackBarService: SnackBarService,
    private dialog: MatDialogRef<CreateUserDialogComponent>,
    private adminCockpitService: AdminCockpitService
  ) {
  }

  ngOnDestroy(): void {
    this.translocoSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.createForm = new FormGroup({
      username: new FormControl(this.userInfo.userName, Validators.required),
      email: new FormControl(this.userInfo.email, [
        Validators.required,
        Validators.pattern(this.REGEXP_EMAIL),
      ]),
      password: new FormControl(this.userInfo.password, Validators.required),
      role: new FormControl(this.userInfo.role, Validators.required),
      confirmPassword: new FormControl(this.userInfo.confirmPassword, Validators.required),
    });
    this.translocoService.langChanges$.subscribe((event: any) => {
      this.translocoSubscription = this.translocoService
      .selectTranslateObject('alerts.adminCockpitAlerts', {}, event)
      .subscribe((alertsAdminCockpitAlerts) => {
        this.userCreationSuccessAltert = alertsAdminCockpitAlerts.createUserSuccess;
        this.usernameNotAvailableAlert = alertsAdminCockpitAlerts.usernameNotAvailable;
      });
      moment.locale(this.translocoService.getActiveLang());
    });
  }

  get userName(): AbstractControl {
    return this.createForm.get('userName');
  }
  get email(): AbstractControl {
    return this.createForm.get('email');
  }

  get password(): AbstractControl {
    return this.createForm.get('password');
  }

  get confirmPassword(): AbstractControl {
    return this.createForm.get('confirmPassword');
  }

  get role(): AbstractControl {
    return this.createForm.get('role');
  }

  validateEmail(event: MatChipInputEvent): void {
    this.CreateModel.push(event.value);
    event.input.value = '';
    if (!emailValidator(last(this.CreateModel))) {
      this.CreateModel.pop();
      this.snackBarService.openSnack(
        this.translocoService.translate('bookTable.formErrors.emailFormat'),
        1000,
        'red',
      );
    }
  }

  submit() : void {
    this.adminCockpitService.getUserByName(this.createForm.value.username).subscribe((data: any) => {
      if (data) {
        this.snackBarService.openSnack(this.usernameNotAvailableAlert, 5000, "red");
        this.createForm.controls.username.reset();
      } else {
        const userData = {
          username : this.createForm.value.username ,
          email : this.createForm.value.email,
          twoFactorStatus : false,
          userRoleId : this.createForm.value.role,
          password: this.createForm.value.password
        };
        this.adminCockpitService.updateUser(userData).subscribe((data: any) => {
          this.adminCockpitService.emitUsersChanged();
          this.snackBarService.openSnack(this.userCreationSuccessAltert, 5000, "green");
        });
        this.dialog.close();
      }
    });
  }

  passwordIdentical() :boolean{
    if(this.createForm.value.password === this.createForm.value.confirmPassword && this.createForm.value.confirmPassword != ''){
      return true;
    } else {
      return false;
    } 
  }

}
