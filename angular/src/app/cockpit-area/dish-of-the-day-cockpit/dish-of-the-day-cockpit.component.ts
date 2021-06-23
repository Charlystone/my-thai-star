import { DishView } from '../../shared/view-models/interfaces';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import * as moment from 'moment';
import { ConfigService } from '../../core/config/config.service';
import { TranslocoService } from '@ngneat/transloco';
import { Subscription } from 'rxjs';
import { MenuService } from 'app/menu/services/menu.service';
import { FilterCockpit, Filter, Pageable } from 'app/shared/backend-models/interfaces';
import { SnackBarService } from 'app/core/snack-bar/snack-bar.service';

@Component({
  selector: 'app-dish-of-the-day-cockpit',
  templateUrl: './dish-of-the-day-cockpit.component.html',
  styleUrls: ['./dish-of-the-day-cockpit.component.scss']
})
export class DishOfTheDayCockpitComponent implements OnInit, OnDestroy {
  private translocoSubscription = Subscription.EMPTY;

  private pageable: Pageable = {
    pageSize: 32,
    pageNumber: 0,
    sort: [
      {
        property: "id",
        direction: "ASC",
      },
    ],
  };

  pageSizes: number[];
  pageSize = 32;

  @ViewChild('pagingBar', { static: true }) pagingBar: MatPaginator;

  dishes: DishView[] = [];
  totalDishes: number;

  columns: any[];
  displayedColumns: string[] = ['dishId', 'dishName', 'dishPrice', 'isDishOfTheDay', 'dailyPrice'];

  dishOfTheDaySucessAlert: string;
  dailyPriceSucessAlert: string;

  constructor(
    private menuService: MenuService,
    private translocoService: TranslocoService,
    private configService: ConfigService,
    private snackBarService: SnackBarService,
  ) {
    this.pageSizes = this.configService.getValues().pageSizes;
  }

  ngOnInit(): void {
    this.translocoService.langChanges$.subscribe((event: any) => {
      this.setTableHeaders(event);
      moment.locale(this.translocoService.getActiveLang());
    });
    this.applyFilters();
  }

  setTableHeaders(lang: string): void {
    this.translocoSubscription = this.translocoService
      .selectTranslateObject('cockpit.dishOfTheDay', {}, lang)
      .subscribe((dishOfTheDay) => {
        this.columns = [
          { name: 'dish.dishId', label: dishOfTheDay.tableHeaders.dishIdH },
          { name: 'dish.dishName', label: dishOfTheDay.tableHeaders.dishNameH },
          { name: 'dish.dishPrice', label: dishOfTheDay.tableHeaders.dishPriceH },
          { name: 'dish.isDishOfTheDay', label: dishOfTheDay.tableHeaders.isDishOfTheDayH },
          { name: 'dish.dailyPrice', label: dishOfTheDay.tableHeaders.dailyPriceH },
        ];
        this.dishOfTheDaySucessAlert = dishOfTheDay.dishOfTheDaySucessAlert;
        this.dailyPriceSucessAlert = dishOfTheDay.dailyPriceSucessAlert;
      });
  }

  applyFilters(): void {
    this.menuService
      .getDishes({
        categories: [],
        maxPrice: null,
        minLikes: null,
        pageable: this.pageable, 
        searchBy: '',
      })
      .subscribe((data: any) => {
        if (!data) {
          this.dishes = [];
        } else {
          this.dishes = data.content;
        }
        this.totalDishes = data.totalElements;
      });
  }

  page(pagingEvent: PageEvent): void {
    this.pageable = {
      pageSize: pagingEvent.pageSize,
      pageNumber: pagingEvent.pageIndex,
      sort: this.pageable.sort,
    };
    this.applyFilters();
  }

  setIsDishOfTheDay(element): void {
    element.dish.isDishOfTheDay = !element.dish.isDishOfTheDay;
    if(element.dish.dailyPrice == null && element.dish.isDishOfTheDay) {
      element.dish.dailyPrice = element.dish.price.toFixed(2);
    }
    this.menuService.saveDish(element.dish).subscribe((data: any) => {
      this.applyFilters();
      this.snackBarService.openSnack(this.dishOfTheDaySucessAlert, 5000, "green");
    });
  }

  updateDailyPrice(element, event): void {
    if(event.srcElement.value) {
      element.dish.dailyPrice = event.srcElement.value.replace(',', '.');
      this.menuService.saveDish(element.dish).subscribe((data: any) => {
        this.applyFilters();
        this.snackBarService.openSnack(this.dailyPriceSucessAlert, 5000, "green");
      });
    }
  }

  ngOnDestroy(): void {
    this.translocoSubscription.unsubscribe();
  }
}
