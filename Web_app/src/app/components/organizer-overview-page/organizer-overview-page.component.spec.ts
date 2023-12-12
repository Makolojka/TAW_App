import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizerOverviewPageComponent } from './organizer-overview-page.component';

describe('OrganizerOverviewPageComponent', () => {
  let component: OrganizerOverviewPageComponent;
  let fixture: ComponentFixture<OrganizerOverviewPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OrganizerOverviewPageComponent]
    });
    fixture = TestBed.createComponent(OrganizerOverviewPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
