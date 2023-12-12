import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { organiserPanelGuard } from './organiser-panel.guard';

describe('organiserguardGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
      TestBed.runInInjectionContext(() => organiserPanelGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
