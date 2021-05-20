import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {BookingInfo, UserInfo} from '../../../shared/backend-models/interfaces';
import { SnackBarService } from 'app/core/snack-bar/snack-bar.service';
import { WindowService } from '../../../core/window/window.service';
import { TranslocoService } from '@ngneat/transloco';
import { Title } from '@angular/platform-browser';
import { AdminCockpitService } from 'app/cockpit-area/services/admin-cockpit.service';
import * as moment from 'moment';

@Component({
  selector: 'app-new-password-dialog',
  templateUrl: './new-password-dialog.component.html',
  styleUrls: ['./new-password-dialog.component.scss']
})
export class NewPasswordDialogComponent implements OnInit {
 
  CreateModel: string[] = [];
  minDate: Date = new Date();
  bookForm: FormGroup;
  createForm: FormGroup;
  data: any;
  isPasswordVisible: boolean =false;
  
  selected: string;
  REGEXP_EMAIL = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

  userInfo: UserInfo = {
    userName: '',
    email: '',
    password: '',
    role: '',
    confirmPassword: ''
  };

  updatePasswordSuccessAlert;
  translocoSubscription;

  constructor(
    private window: WindowService,
    private translocoService: TranslocoService,
    private snackBarService: SnackBarService,
    private dialog: MatDialogRef<NewPasswordDialogComponent>,
    private adminCockpitService: AdminCockpitService,
    @Inject(MAT_DIALOG_DATA) dialogData: any
  ) {
    this.data = dialogData;
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
        this.updatePasswordSuccessAlert = alertsAdminCockpitAlerts.updatePasswordSuccess;
      });
      moment.locale(this.translocoService.getActiveLang());
    });
  }
  signInSubmit(formValue: FormGroup): void {
  }

  get password(): AbstractControl {
    return this.createForm.get('password');
  }

  get confirmPassword(): AbstractControl {
    return this.createForm.get('confirmPassword');
  }

  submitCreationData() : void {
    const userData = {
      username : this.data.username,
      email : this.data.email,
      twoFactorStatus : false,
      userRoleId : this.data.userRoleId, 
      password : this.createForm.value.password
    };
    this.adminCockpitService.createUser(userData).subscribe((data: any) => {
      this.adminCockpitService.emitUsersChanged();
      this.snackBarService.openSnack(this.updatePasswordSuccessAlert, 5000, "green");
    });
    this.dialog.close();
  }

  passwordIdentical() :boolean{
    if(this.createForm.value.password === this.createForm.value.confirmPassword && this.createForm.value.confirmPassword != ''){
      return true;
    } else {
      return false;
    }
  }

  togglemyPassword(): void{
    this.isPasswordVisible = !this.isPasswordVisible;
  }
}
