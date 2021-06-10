import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { NewPasswordDialogComponent } from 'app/cockpit-area/admin-cockpit/new-password-dialog/new-password-dialog.component';
import { SnackBarService } from 'app/core/snack-bar/snack-bar.service';
import { UserAreaService } from '../services/user-area.service';
import * as authActions from '../store/actions/auth.actions';
import * as fromAuth from '../store/reducers/';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss']
})
export class PasswordResetComponent implements OnInit {
  token: string;
  data = {
    modificationCounter:1,
    id:0,
    username:"",
    email:"",
    twoFactorStatus:false,
    userRoleId:0,
    password:""
  };

  constructor(
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private userAreaService: UserAreaService,
    private store: Store<fromAuth.AppState>,
    private snackBarService: SnackBarService,
    ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.token = params.token;
      this.data.username = params.username;

      this.store.dispatch(authActions.login({username: this.data.username, password: this.token}));

      setTimeout(() => {
        this.userAreaService.getUserByUsername(this.data.username).subscribe((data) => {
          this.data = data;

          this.userAreaService.validateResetLink(this.token).subscribe((data) => {
            if (data) {
              this.dialog.open(NewPasswordDialogComponent, {
                width: '25%',
                data: this.data
              });
            } else {
              this.snackBarService.openSnack('Reset link not valid!', 4000, 'red');
            }
          });
        });
      }, 2500);
    });
  }

}
