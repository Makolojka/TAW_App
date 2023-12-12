import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventCardWideComponent } from './event-card-wide.component';

describe('EventCardWideComponent', () => {
  let component: EventCardWideComponent;
  let fixture: ComponentFixture<EventCardWideComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EventCardWideComponent]
    });
    fixture = TestBed.createComponent(EventCardWideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
