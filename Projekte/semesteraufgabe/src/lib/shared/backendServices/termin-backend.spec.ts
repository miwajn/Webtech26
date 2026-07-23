import { TestBed } from '@angular/core/testing';

import { TerminBackend } from '../termin-backend';

describe('TerminBackend', () => {
  let service: TerminBackend;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TerminBackend);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
