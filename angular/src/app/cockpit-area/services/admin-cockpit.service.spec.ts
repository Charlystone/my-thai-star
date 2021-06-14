import { inject, TestBed } from "@angular/core/testing";
import { ConfigService } from '../../core/config/config.service';
import { config } from '../../core/config/config';
import { provideMockStore } from "@ngrx/store/testing";
import { AdminCockpitService } from "./admin-cockpit.service";
import { HttpClientTestingModule } from "@angular/common/http/testing";

describe('AdminCockpitService', () => {
    let initialState;
    beforeEach(() => {
        initialState = { config };
        TestBed.configureTestingModule({
        providers: [
            provideMockStore({ initialState }),
            AdminCockpitService,
            ConfigService,
        ],
        imports: [HttpClientTestingModule],
        });
    });
    
    it('should create', inject(
        [AdminCockpitService],
        (service: AdminCockpitService) => {
            expect(service).toBeTruthy();
        },
    ));
});