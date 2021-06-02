import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCockpitComponent } from './admin-cockpit.component';
import {MatDialog} from "@angular/material/dialog";
import {Overlay} from "@angular/cdk/overlay";

describe('AdminCockpitComponent', () => {
  let component: AdminCockpitComponent;
  let fixture: ComponentFixture<AdminCockpitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminCockpitComponent ],
      providers: [
        MatDialog,
        Overlay,
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminCockpitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
