import { TestBed } from '@angular/core/testing';

import { GeolocatorService } from './geolocator.service';

describe('GeolocatorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GeolocatorService = TestBed.get(GeolocatorService);
    expect(service).toBeTruthy();
  });
});
