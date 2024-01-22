import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SnackbarSuccessComponent } from './snackbar-success.component';

describe('SnackbarSuccessComponent', () => {
  let component: SnackbarSuccessComponent;
  let fixture: ComponentFixture<SnackbarSuccessComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SnackbarSuccessComponent]
    });
    fixture = TestBed.createComponent(SnackbarSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
