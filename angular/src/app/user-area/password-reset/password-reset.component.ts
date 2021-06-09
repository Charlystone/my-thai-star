import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { SnackBarService } from 'app/core/snack-bar/snack-bar.service';
import { UserAreaService } from '../services/user-area.service';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss']
})
export class PasswordResetComponent implements OnInit {
  userId: string;
  hashCode: string;

  constructor(
    private route: ActivatedRoute,
    private userAreaService: UserAreaService
    ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.hashCode = params.hashCode;

      this.userAreaService.validateResetLink(this.hashCode).subscribe((data) => {
        console.log(data)
      });
    });
  }

}
