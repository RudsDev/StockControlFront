import { TestBed } from '@angular/core/testing';

import { AuthGuardRouteService } from './auth-guard-route.service';

describe('AuthGuardRouteService', () => {
  let service: AuthGuardRouteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthGuardRouteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
