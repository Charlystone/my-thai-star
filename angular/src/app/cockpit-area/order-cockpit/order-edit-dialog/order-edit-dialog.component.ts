import {Component, Inject, OnInit} from '@angular/core';
import {OrderView} from '../../../shared/view-models/interfaces';
import {WaiterCockpitService} from '../../services/waiter-cockpit.service';
import {TranslocoService} from '@ngneat/transloco';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {ConfigService} from '../../../core/config/config.service';
import {PageEvent} from '@angular/material/paginator';
import { SnackBarService } from 'app/core/snack-bar/snack-bar.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MenuService } from 'app/menu/services/menu.service';
import { Pageable } from 'app/shared/backend-models/interfaces';
@Component({
  selector: 'app-order-edit-dialog',
  templateUrl: './order-edit-dialog.component.html',
  styleUrls: ['./order-edit-dialog.component.scss']
})
export class OrderEditComponent implements OnInit {

  private fromRow = 0;
  private currentPage = 1;

  pageSize = 4;

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
  editedOrderLines: any[] = [];

  updateSuccessAlert: string;
  updateFailAlert: string;

  showNewOrderLineDialog = false;
  newOrderLineForm: FormGroup;
  availableDishes;
  availableOrderLineExtras;
  availableCategories = [];
  selectedCategories = [];

  constructor(
    private waiterCockpitService: WaiterCockpitService,
    private translocoService: TranslocoService,
    @Inject(MAT_DIALOG_DATA) dialogData: any,
    private configService: ConfigService,
    private snackBarService: SnackBarService,
    private menuService: MenuService,
  ) {
    this.data = dialogData;
    this.pageSizes = this.configService.getValues().pageSizesDialog;
  }

  ngOnInit(): void {
    this.translocoService.langChanges$.subscribe((lang: string) => {
      this.setTableHeaders(lang);
      this.setAlerts(lang);
      this.setCategoryNames(lang);
    });
    this.showNewOrderLineDialog = false;
    this.totalPrice = this.waiterCockpitService.getTotalPrice(
      this.data.orderLines,
    );
    this.datao = this.waiterCockpitService.orderComposer(this.data.orderLines);
    this.filter();
  }

  setCategoryNames(lang: string) {
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
      this.updateSuccessAlert = alertsWaiterCockpitAlerts.updateOrderLineSuccess;
      this.updateFailAlert = alertsWaiterCockpitAlerts.updateOrderLineFail;
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

  deleteOrder() {
    if (confirm('Bestellung wirklich löschen?')) {
      const id = this.data.order.id;
      this.waiterCockpitService.updateOrderState("canceled", id).subscribe((data: any) => {
        this.snackBarService.openSnack(this.cancelSuccessAlert, 5000, "green");
        this.waiterCockpitService.emitOrdersChanged();
      });
    }
  }

  loadDishes() {
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

  switchDishCategory(category: any) {
    this.selectedCategories = [ { id: category.id } ];
    this.loadDishes();
  }

  toggleNewOrderLineDialog() {
    this.showNewOrderLineDialog = !this.showNewOrderLineDialog;
    if (this.showNewOrderLineDialog) {
      this.loadDishes();
      this.newOrderLineForm = new FormGroup({
        category: new FormControl(null, Validators.required),
        dish: new FormControl(null, Validators.required),
        comment: new FormControl(null),
        extras: new FormControl(null),
        amount: new FormControl(1, Validators.required),
      });
    }
  }

  addOrderLine() {
    const newOrderLine = {
      orderLine: {
        id: null,
        amount: 1,
        comment: this.newOrderLineForm.value.comment,
        dishId: this.newOrderLineForm.value.dish.id,
        modificationCounter: 1,
        orderId: this.data.order.id,
      },
      dish: this.newOrderLineForm.value.dish,
      extras: this.newOrderLineForm.value.extras,
      deleted: false,
    }
    this.data.orderLines.push(newOrderLine);
    this.saveUpdatedOrderLines(newOrderLine);
  }

  decreaceOrderLineAmount(element: any): void {
    element.orderLine.amount--;
    this.updateOrderLineAmount(element);
  }

  increaseOrderLineAmount(element: any): void {
    element.orderLine.amount++;
    this.updateOrderLineAmount(element);
  }

  private updateOrderLineAmount(element) {
    for(let orderLine of this.data.orderLines) {
      if(orderLine.orderLine.id == element.orderLine.id) {
        orderLine.orderLine.amount = element.orderLine.amount;
      }
    }
    element.deleted = false;
    this.saveUpdatedOrderLines(element);
  }

  deleteOrderLine(element: any): void {
    if (confirm('Position wirklich löschen?')) {
      for(let orderLine of this.data.orderLines) {
        if (orderLine.orderLine.id == element.orderLine.id) {
          this.data.orderLines.splice(this.data.orderLines.indexOf(orderLine), 1);
        }
      }
      element.deleted = true;
      this.saveUpdatedOrderLines(element);
    }
  }

  private saveUpdatedOrderLines(element) {
    for(let orderLine of this.editedOrderLines) {
      if (orderLine.orderLine.id == element.orderLine.id) {
        this.editedOrderLines.splice(this.editedOrderLines.indexOf(orderLine), 1);
      }
    }
    this.editedOrderLines.push(element);
    this.ngOnInit();
  }

  saveOrder() {
    this.updateOrderLine(this.editedOrderLines, 0);
  }

  private updateOrderLine(orderLines: any[], orderLineIndex: number) {
    if (orderLines[orderLineIndex].deleted == true && orderLineIndex < orderLines.length - 1) { // delete
      this.waiterCockpitService.deleteOrderLine(orderLines[orderLineIndex].orderLine.id).subscribe((data: any) => {
        return this.updateOrderLine(orderLines, ++orderLineIndex);
      });
    }
    if (orderLines[orderLineIndex].deleted == false && orderLineIndex < orderLines.length - 1) { // update
      this.waiterCockpitService.updateOrderLineAmount(orderLines[orderLineIndex].orderLine).subscribe((data: any) => {
        return this.updateOrderLine(orderLines, ++orderLineIndex);
      });
    }
    if (orderLines[orderLineIndex].deleted == true && orderLineIndex == orderLines.length - 1) { // last orderLine and delete
      this.waiterCockpitService.deleteOrderLine(orderLines[orderLineIndex].orderLine.id).subscribe((data: any) => {
        this.snackBarService.openSnack(this.updateSuccessAlert, 5000, "green");
        this.waiterCockpitService.emitOrdersChanged();
      });
    }
    if (orderLines[orderLineIndex].deleted == false && orderLineIndex == orderLines.length - 1) { // last orderLine and update
      this.waiterCockpitService.updateOrderLineAmount(orderLines[orderLineIndex].orderLine).subscribe((data: any) => {
        this.snackBarService.openSnack(this.updateSuccessAlert, 5000, "green");
        this.waiterCockpitService.emitOrdersChanged();
      });
    }
  }

  cancelEditing() {
    this.waiterCockpitService.emitOrdersChanged();
  }
}
