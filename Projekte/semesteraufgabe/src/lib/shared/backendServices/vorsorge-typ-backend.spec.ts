import { TestBed } from '@angular/core/testing';

import { VorsorgeTypBackend } from './vorsorge-typ-backend';

describe('VorsorgeTypBackend', () => {
  let service: VorsorgeTypBackend;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VorsorgeTypBackend);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
