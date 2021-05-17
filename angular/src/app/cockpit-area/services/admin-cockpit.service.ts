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
  private readonly getReservationsRestPath: string =
    'usermanagement/v1/userrole/search';
  private readonly restServiceRoot$: Observable<
    string
  > = this.config.getRestServiceRoot();


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
,
  ): Observable<UserResponse[]> {
    this.filters.pageable = pageable;
   this. filters.pageable.sort = this.sorting;
    return this.restServiceRoot$.pipe(
      exhaustMap((restServiceRoot) =>
        this.http.post<UserResponse[]>(
          `${restServiceRoot}${this.getReservationsRestPath}`,
          this.filters,
        ),
      ),
    );
  }




  
 
}
