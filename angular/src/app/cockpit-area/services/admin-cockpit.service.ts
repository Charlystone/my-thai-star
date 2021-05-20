import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable, OnInit } from '@angular/core';
import {
  FilterCockpit,
  Pageable,
  Sort,
} from 'app/shared/backend-models/interfaces';
import { cloneDeep, map } from 'lodash';
import { Observable } from 'rxjs';
import { exhaustMap } from 'rxjs/operators';
import { ConfigService } from '../../core/config/config.service';
import {
  BookingResponse,
  OrderResponse,
  OrderView,
  OrderViewResult,
  UserResponse,
} from '../../shared/view-models/interfaces';
import { PriceCalculatorService } from '../../sidenav/services/price-calculator.service';
import { SnackBarService } from 'app/core/snack-bar/snack-bar.service';
import { TranslocoService } from '@ngneat/transloco';

@Injectable()
export class AdminCockpitService {
  private readonly getUserRestPath: string =
    'usermanagement/v1/user/search';
    private readonly postUserData: string =
    'usermanagement/v1/user';
    private readonly deleteUserDataPath: string =
    'usermanagement/v1/user';
    

  private readonly restServiceRoot$: Observable<
    string
  > = this.config.getRestServiceRoot();

  usersChanged = new EventEmitter<boolean>();


  constructor(
    private http: HttpClient,
    private config: ConfigService,
    private translocoService: TranslocoService,
  ) {
    this.translocoService.langChanges$.subscribe((event: any) => {

    });
  }
    sorting: Sort[];
    filters: FilterCockpit;


  getUsers(
    pageable: Pageable,
    sorting: Sort[],
    filters: FilterCockpit,
  ): Observable<OrderResponse[]> {
    let path: string;
    filters.pageable = pageable;
    filters.pageable.sort = sorting;
    if (true) {
      path = this.getUserRestPath;
    }
    return this.restServiceRoot$.pipe(
      exhaustMap((restServiceRoot) =>
        this.http.post<OrderResponse[]>(`${restServiceRoot}${path}`, filters),
      ),
    );
  }

  sendUserData(newUser: any): Observable<OrderResponse[]> {
    return this.restServiceRoot$.pipe(
      exhaustMap((restServiceRoot) =>
        this.http.post<OrderResponse[]>(`${restServiceRoot}${this.postUserData}`, newUser),
      ),
    );
  }

  deleteUser(userId: number): Observable<OrderResponse[]> {
    return this.restServiceRoot$.pipe(
      exhaustMap((restServiceRoot) =>
        this.http.delete<OrderResponse[]>(`${restServiceRoot}${this.deleteUserDataPath}`+'/'+userId),
      ),
    );
  }

  emitUsersChanged() {
    this.usersChanged.emit(true);
  }
}