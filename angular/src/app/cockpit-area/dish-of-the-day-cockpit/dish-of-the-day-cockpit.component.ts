import { DishView } from '../../shared/view-models/interfaces';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import * as moment from 'moment';
import { ConfigService } from '../../core/config/config.service';
import { TranslocoService } from '@ngneat/transloco';
import { Subscription } from 'rxjs';
import { MenuService } from 'app/menu/services/menu.service';
import { FilterCockpit, Filter } from 'app/shared/backend-models/interfaces';

@Component({
  selector: 'app-dish-of-the-day-cockpit',
  templateUrl: './dish-of-the-day-cockpit.component.html',
  styleUrls: ['./dish-of-the-day-cockpit.component.scss']
})
export class DishOfTheDayCockpitComponent implements OnInit, OnDestroy {
  private translocoSubscription = Subscription.EMPTY;
  
  private filter: Filter = {
    categories: [],
    maxPrice: null,
    minLikes: null,
    pageable: {
      pageNumber: 0,
      pageSize: 8,
      sort: [
        {
          property: "price",
          direction: "DESC",
        },
      ],
    },
    searchBy: '',
  };

  @ViewChild('pagingBar', { static: true }) pagingBar: MatPaginator;

  dishes: DishView[] = [];
  totalDishes: number;

  columns: any[];
  displayedColumns: string[] = ['dishId', 'dishName', 'dishPrice', 'isDishOfTheDay'];

  constructor(
    private menuService: MenuService,
    private translocoService: TranslocoService,
  ) {
    
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
      .selectTranslateObject('cockpit.dishOfTheDay.tableHeaders', {}, lang)
      .subscribe((tableHeaders) => {
        this.columns = [
          { name: 'dish.dishId', label: tableHeaders.dishIdH },
          { name: 'dish.dishName', label: tableHeaders.dishNameH },
          { name: 'dish.dishPrice', label: tableHeaders.dishPriceH },
          { name: 'dish.isDishOfTheDay', label: tableHeaders.isDishOfTheDayH },
        ];
      });
  }

  applyFilters(): void {
    this.menuService
      .getDishes(this.filter)
      .subscribe((data: any) => {
        if (!data) {
          this.dishes = [];
        } else {
          this.dishes = data.content;
        }
        this.totalDishes = data.totalElements;
      });
  }

  ngOnDestroy(): void {
    this.translocoSubscription.unsubscribe();
  }
}
