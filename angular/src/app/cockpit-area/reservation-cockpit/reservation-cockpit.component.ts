import { WaiterCockpitService } from '../services/waiter-cockpit.service';
import { ReservationView } from '../../shared/view-models/interfaces';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { ReservationDialogComponent } from './reservation-dialog/reservation-dialog.component';
import {
  FilterCockpit,
  Pageable,
} from '../../shared/backend-models/interfaces';
import * as moment from 'moment';
import { ConfigService } from '../../core/config/config.service';
import { TranslocoService } from '@ngneat/transloco';
import { Subscription } from 'rxjs';
import { SnackBarService } from 'app/core/snack-bar/snack-bar.service';

@Component({
  selector: 'app-cockpit-reservation-cockpit',
  templateUrl: './reservation-cockpit.component.html',
  styleUrls: ['./reservation-cockpit.component.scss'],
})
export class ReservationCockpitComponent implements OnInit, OnDestroy {
  private sorting: any[] = [];
  private translocoSubscription = Subscription.EMPTY;
  pageable: Pageable = {
    pageSize: 8,
    pageNumber: 0,
    // total: 1,
  };

  @ViewChild('pagingBar', { static: true }) pagingBar: MatPaginator;

  reservations: ReservationView[] = [];
  totalReservations: number;

  columns: any[];
  displayedColumns: string[] = ['bookingDate', 'guestName', 'email', 'tableNr'];

  pageSizes: number[];

  filters: FilterCockpit = {
    bookingDate: undefined,
    email: undefined,
    bookingToken: undefined
  };

  saveTableNrSuccessAlert: string;
  saveTableNrFailAlert: string;

  constructor(
    private waiterCockpitService: WaiterCockpitService,
    private translocoService: TranslocoService,
    private dialog: MatDialog,
    private configService: ConfigService,
    private snackBarService: SnackBarService,
  ) {
    this.pageSizes = this.configService.getValues().pageSizes;
  }

  ngOnInit(): void {
    this.sorting.push({
      property: 'bookingDate',
      direction: 'asc',
    });
    this.translocoService.langChanges$.subscribe((event: any) => {
      this.setTableHeaders(event);
      moment.locale(this.translocoService.getActiveLang());
    });
    this.applyFilters();
  }

  setTableHeaders(lang: string): void {
    this.translocoSubscription = this.translocoService
      .selectTranslateObject('cockpit.table', {}, lang)
      .subscribe((cockpitTable) => {
        this.columns = [
          { name: 'booking.bookingDate', label: cockpitTable.reservationDateH },
          { name: 'booking.guestName', label: cockpitTable.guestNameH },
          { name: 'booking.email', label: cockpitTable.emailH },
          { name: 'booking.tableNr', label: cockpitTable.tableH },
        ];
        this.saveTableNrSuccessAlert = cockpitTable.saveTableNrSuccessAlert;
        this.saveTableNrFailAlert = cockpitTable.saveTableNrFailAlert;
      });
  }

  filter(): void {
    this.pageable.pageNumber = 0;
    this.applyFilters();
  }

  applyFilters(): void {
    this.waiterCockpitService
      .getReservations(this.pageable, this.sorting, this.filters)
      .subscribe((data: any) => {
        if (!data) {
          this.reservations = [];
        } else {
          this.reservations = data.content;
        }
        this.totalReservations = data.totalElements;
      });
  }

  clearFilters(filters: any): void {
    filters.reset();
    this.applyFilters();
    this.pagingBar.firstPage();
  }

  page(pagingEvent: PageEvent): void {
    this.pageable = {
      pageSize: pagingEvent.pageSize,
      pageNumber: pagingEvent.pageIndex,
      sort: this.pageable.sort,
      // total: 1,
    };
    this.applyFilters();
  }

  sort(sortEvent: Sort): void {
    this.sorting = [];
    if (sortEvent.direction) {
      this.sorting.push({
        property: sortEvent.active,
        direction: '' + sortEvent.direction,
      });
    }
    this.applyFilters();
  }

  selected(selection: ReservationView): void {
    this.dialog.open(ReservationDialogComponent, {
      width: '80%',
      data: selection,
    });
  }

  setTableNr(element, event) {
    const booking = {
      booking: element.booking
    }
    if(event.srcElement.value) {
      element.booking.tableId = parseInt(event.srcElement.value);
      this.waiterCockpitService.saveBooking(booking).subscribe((data: any) => {
        this.applyFilters();
        this.snackBarService.openSnack(this.saveTableNrSuccessAlert, 5000, "green");
      },
      (error: any) => {
        this.snackBarService.openSnack(this.saveTableNrFailAlert, 5000, "red");
      });
    }
    event.stopPropagation();
  }

  ngOnDestroy(): void {
    this.translocoSubscription.unsubscribe();
  }
}
