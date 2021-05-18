import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import {BookingInfo, UserInfo} from '../../../shared/backend-models/interfaces';
import { last } from 'lodash';
import * as moment from 'moment';
import { SnackBarService } from 'app/core/snack-bar/snack-bar.service';
import { WindowService } from '../../../core/window/window.service';
import { emailValidator } from '../../../shared/directives/email-validator.directive';
import { TranslocoService } from '@ngneat/transloco';
import { Title } from '@angular/platform-browser';
import { AdminCockpitService } from 'app/cockpit-area/services/admin-cockpit.service';

@Component({
  selector: 'app-create-user-dialog',
  templateUrl: './create-user-dialog.component.html',
  styleUrls: ['./create-user-dialog.component.scss']
})

export class CreateUserDialogComponent implements OnInit {
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

  constructor(
    private window: WindowService,
    private translocoService: TranslocoService,
    private snackBarService: SnackBarService,
    private dialog: MatDialogRef<CreateUserDialogComponent>,
    private adminCockpitService: AdminCockpitService,
    title: Title
  ) {
    title.setTitle('Create a user');
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

  save():void{
    console.log(this.createForm);
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
  logInSubmit(formValue: FormGroup): void {
   
  }

  signInSubmit(formValue: FormGroup): void {

   
  }

  closeLoginDialog(): void {
    this.dialog.close();
  }
  submitCreationData() : void {
    const userData ={username : this.createForm.value.username ,
       email : this.createForm.value.email,
        twoFactorStatus : false,
         userRoleId : this.createForm.value.role  
        };
    this.adminCockpitService.sendUserData(userData).subscribe((data: any) => {});
    this.dialog.close();
  }
  passwordIdentical() :boolean{
    if(this.createForm.value.password === this.createForm.value.confirmPassword && this.createForm.value.confirmPassword != ''){
    return true;
  }
  else 
  return false;
  }

}
