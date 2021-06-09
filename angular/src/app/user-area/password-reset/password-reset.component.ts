import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { NewPasswordDialogComponent } from 'app/cockpit-area/admin-cockpit/new-password-dialog/new-password-dialog.component';
import { SnackBarService } from 'app/core/snack-bar/snack-bar.service';
import { UserAreaService } from '../services/user-area.service';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss']
})
export class PasswordResetComponent implements OnInit {
  hashCode: string;
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
    ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.hashCode = params.hashCode;
      this.data.username = params.username;

      this.userAreaService.login('admin', 'password').subscribe((data) => {
        console.log(data);

        this.userAreaService.validateResetLink(this.hashCode).subscribe((data) => {
          console.log(data);
        });
  
        this.userAreaService.getUserByUsername(this.data.username).subscribe((data) => {
          this.data = data;
        });
  
        this.dialog.open(NewPasswordDialogComponent, {
          width: '25%',
          data: this.data
        });
      });
    });
  }

}
