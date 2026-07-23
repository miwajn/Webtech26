import { TestBed } from '@angular/core/testing';

import { UserBackend } from './user-backend';

describe('UserBackend', () => {
  let service: UserBackend;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserBackend);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
