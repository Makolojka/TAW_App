import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LatestEventsComponent } from './latest-events.component';

describe('LatestEventsComponent', () => {
  let component: LatestEventsComponent;
  let fixture: ComponentFixture<LatestEventsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LatestEventsComponent]
    });
    fixture = TestBed.createComponent(LatestEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
