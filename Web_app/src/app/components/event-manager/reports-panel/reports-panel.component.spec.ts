import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportsPanelComponent } from './reports-panel.component';

describe('ReportsPanelComponent', () => {
  let component: ReportsPanelComponent;
  let fixture: ComponentFixture<ReportsPanelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReportsPanelComponent]
    });
    fixture = TestBed.createComponent(ReportsPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
