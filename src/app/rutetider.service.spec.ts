import { TestBed } from '@angular/core/testing';

import { RutetiderService } from './rutetider.service';

describe('RutetiderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RutetiderService = TestBed.get(RutetiderService);
    expect(service).toBeTruthy();
  });
});
