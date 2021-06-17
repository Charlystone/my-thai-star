import {Component, OnInit} from '@angular/core';
import {OrderView, ReservationView} from '../../../shared/view-models/interfaces';
import {WaiterCockpitService} from '../../services/waiter-cockpit.service';
import {TranslocoService} from '@ngneat/transloco';
import {ConfigService} from '../../../core/config/config.service';
import {PageEvent} from '@angular/material/paginator';
import { SnackBarService } from 'app/core/snack-bar/snack-bar.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MenuService } from 'app/menu/services/menu.service';
import { FilterCockpit, Pageable } from 'app/shared/backend-models/interfaces';
@Component({
  selector: 'app-new-order-dialog',
  templateUrl: 'new-order-dialog.component.html',
  styleUrls: ['new-order-dialog.component.scss']
})
export class NewOrderDialogComponent implements OnInit {
  private sorting: any[] = [];
  private fromRow = 0;
  private currentPage = 1;

  pageSize = 8;

  private pageable: Pageable = {
    pageSize: 100,
    pageNumber: 0,
    sort: [
      {
        property: "id",
        direction: "ASC",
      },
    ],
  };

  filters: FilterCockpit = {
    bookingDate: undefined,
    email: undefined,
    bookingToken: undefined
  };

  columns: any[];
  displayedColumns: string[] = ['bookingDate', 'guestName', 'email', 'tableNr'];

  data: any;
  datao: OrderView[] = [];
  columnso: any[];
  displayedColumnsO: string[] = [
    'dish.name',
    'orderLine.comment',
    'extras',
    'orderLine.amount',
    'dish.price',
    'orderLine.delete'
  ];
  cancelSuccessAlert: string;
  pageSizes: number[];
  filteredData: OrderView[] = this.datao;
  totalPrice: number;

  isNew: boolean;
  orderCreationSuccessAlert: string;
  orderCreationFailAlert: string;

  reservations: ReservationView[] = [];
  totalReservations: number;

  showNewOrderLineDialog = false;
  newOrderLineForm: FormGroup;
  newOrderLineDialogPlaceholder;
  availableDishes = [];
  availableCategories = [];
  selectedCategories = [];
  availableExtraIngredients = [];

  constructor(
    private waiterCockpitService: WaiterCockpitService,
    private translocoService: TranslocoService,
    private configService: ConfigService,
    private snackBarService: SnackBarService,
    private menuService: MenuService,
  ) {
    this.isNew = true;
    this.data = {
      booking: {
        bookingToken: '',
      },
      order: {
        orderState: 'orderTaken',
        paymentState: 'pending',
      },
      orderLines: [],
    };
    this.pageSizes = this.configService.getValues().pageSizesDialog;
  }

  ngOnInit(): void {
    this.translocoService.langChanges$.subscribe((lang: string) => {
      this.setTableHeaders(lang);
      this.setReservationsTableHeaders(lang);
      this.setAlerts(lang);
      this.setDishCategoryNames(lang);
      this.setOrderLineDialogPlaceholder(lang);
    });
    this.showNewOrderLineDialog = false;
    if (!this.isNew) {
      this.totalPrice = this.waiterCockpitService.getTotalPrice(
        this.data.orderLines,
      );
      this.datao = this.waiterCockpitService.orderComposer(this.data.orderLines);
      this.filter();
    }
    this.isNew = false;
  }

  loadReservations() {
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

  setOrderLineDialogPlaceholder(lang: string) {
    this.translocoService
    .selectTranslateObject('cockpit.orders.newOrderLineDialogPlaceholder', {}, lang)
    .subscribe((newOrderLineDialogPlaceholder) => {
      this.newOrderLineDialogPlaceholder = {
        category: newOrderLineDialogPlaceholder.category,
        dish: newOrderLineDialogPlaceholder.dish,
        extra: newOrderLineDialogPlaceholder.extra,
      }
    });
  }

  setDishCategoryNames(lang: string) {
    this.translocoService
    .selectTranslateObject('menu.filter', {}, lang)
    .subscribe((menuFilters) => {
      this.availableCategories = [
        { name: menuFilters.mainDishes , id:  0 },
        { name: menuFilters.starters , id:  1 },
        { name: menuFilters.desserts , id:  2 },
        { name: menuFilters.noodle , id:  3 },
        { name: menuFilters.rice , id:  4 },
        { name: menuFilters.curry , id:  5 },
        { name: menuFilters.vegan , id:  6 },
        { name: menuFilters.vegetarian , id:  7 },
        { name: menuFilters.favourites , id:  8 },
      ]
    });
  }

  setAlerts(lang: string): void {
    this.translocoService
    .selectTranslateObject('alerts.waiterCockpitAlerts', {}, lang)
    .subscribe((alertsWaiterCockpitAlerts) => {
      this.orderCreationSuccessAlert = alertsWaiterCockpitAlerts.orderCreationSuccessAlert;
      this.orderCreationFailAlert = alertsWaiterCockpitAlerts.orderCreationFailAlert;
    });
  }

  setReservationsTableHeaders(lang: string): void {
    this.translocoService
      .selectTranslateObject('cockpit.table', {}, lang)
      .subscribe((cockpitTable) => {
        this.columns = [
          { name: 'booking.bookingDate', label: cockpitTable.reservationDateH },
          { name: 'booking.guestName', label: cockpitTable.guestNameH },
          { name: 'booking.email', label: cockpitTable.emailH },
          { name: 'booking.tableNr', label: cockpitTable.tableH },
        ];
      });
  }

  setTableHeaders(lang: string): void {
    this.translocoService
      .selectTranslateObject('cockpit.orders.dialogTable', {}, lang)
      .subscribe((cockpitDialogTable) => {
        this.columnso = [
          { name: 'dish.name', label: cockpitDialogTable.dishH },
          { name: 'orderLine.comment', label: cockpitDialogTable.commentsH },
          { name: 'extras', label: cockpitDialogTable.extrasH },
          { name: 'orderLine.amount', label: cockpitDialogTable.quantityH },
          {
            name: 'dish.price',
            label: cockpitDialogTable.priceH,
            numeric: true,
            format: (v: number) => v.toFixed(2),
          },
        ];
      });
    this.translocoService
    .selectTranslateObject('alerts.waiterCockpitAlerts', {}, lang)
    .subscribe((alertsWaiterCockpitAlerts) => {
      this.cancelSuccessAlert = alertsWaiterCockpitAlerts.cancelOrderSuccess;
    });  
  }

  page(pagingEvent: PageEvent): void {
    this.currentPage = pagingEvent.pageIndex + 1;
    this.pageSize = pagingEvent.pageSize;
    this.fromRow = pagingEvent.pageSize * pagingEvent.pageIndex;
    this.filter();
  }

  filter(): void {
    let newData: OrderView[] = this.datao;
    newData = newData.slice(this.fromRow, this.currentPage * this.pageSize);
    setTimeout(() => (this.filteredData = newData));
  }

  selectReservation(reservation) {
    this.data.booking.bookingToken = reservation.booking.bookingToken;
    for (let item of this.reservations) {
      if (item.booking.bookingToken == reservation.booking.bookingToken) {
        this.reservations = [];
        this.reservations.push(item);
      }
    }
  }

  toggleNewOrderLineDialog() {
    this.showNewOrderLineDialog = !this.showNewOrderLineDialog;
    if (this.showNewOrderLineDialog) {
      this.newOrderLineForm = new FormGroup({
        category: new FormControl(null, Validators.required),
        dish: new FormControl(null, Validators.required),
        comment: new FormControl(null),
        extra: new FormControl(null),
        amount: new FormControl(1, Validators.required),
      });
      this.loadDishes();
    }
  }

  switchDishCategory(category: any) {
    this.selectedCategories = [ { id: category.id } ];
    this.loadDishes();
  }

  loadDishes() {
    this.newOrderLineForm.get('dish').setValue(null);
    this.menuService.getDishes({
      categories: this.selectedCategories,
      maxPrice: null,
      minLikes: null,
      pageable: this.pageable, 
      searchBy: '',
    }).subscribe((data: any) => {
      if (!data) {
        this.availableDishes = [];
      } else {
        this.availableDishes = data.content;
      }
    });
  }

  loadAvailableExtras(item: any) {
    this.availableExtraIngredients = item.extras;
  }

  addOrderLine() {
    const newOrderLine = {
      orderLine: {
        id: Math.floor(Math.random() * 100000),
        amount: 1,
        comment: this.newOrderLineForm.value.comment,
        dishId: this.newOrderLineForm.value.dish.id,
        modificationCounter: 1,
        orderId: this.data.order.id,
      },
      dish: this.newOrderLineForm.value.dish,
      extras: (this.newOrderLineForm.value.extra) ? [ this.newOrderLineForm.value.extra ] : [],
    }
    this.data.orderLines.push(newOrderLine);
    this.ngOnInit();
  }

  decreaceOrderLineAmount(orderLine: any): void {
    orderLine.orderLine.amount--;
    this.updateOrderLineAmount(orderLine);
  }

  increaseOrderLineAmount(orderLine: any): void {
    orderLine.orderLine.amount++;
    this.updateOrderLineAmount(orderLine);
  }

  private updateOrderLineAmount(orderLine: any) {
    for(let item of this.data.orderLines) {
      if(item.orderLine.id == orderLine.orderLine.id) {
        item.orderLine.amount = orderLine.orderLine.amount;
      }
    }
    this.ngOnInit();
  }

  deleteOrderLine(orderLine: any): void {
    if (confirm('Position wirklich löschen?')) {
      for(let item of this.data.orderLines) {
        if (item.orderLine.id == orderLine.orderLine.id) {
          this.data.orderLines.splice(this.data.orderLines.indexOf(item), 1);
        }
      }
      this.ngOnInit();
    }
  }

  saveOrder() {
    this.waiterCockpitService.saveOrder(this.data).subscribe((data: any) => {
      this.snackBarService.openSnack(this.orderCreationSuccessAlert, 5000, "green");
      this.waiterCockpitService.emitOrdersChanged();
    },
    (error: any) => {
      this.snackBarService.openSnack(this.orderCreationFailAlert, 5000, "red");
    });
  }
}
