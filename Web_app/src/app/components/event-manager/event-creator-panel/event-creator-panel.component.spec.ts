import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventCreatorPanelComponent } from './event-creator-panel.component';

describe('EventCreatorPanelComponent', () => {
  let component: EventCreatorPanelComponent;
  let fixture: ComponentFixture<EventCreatorPanelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EventCreatorPanelComponent]
    });
    fixture = TestBed.createComponent(EventCreatorPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
