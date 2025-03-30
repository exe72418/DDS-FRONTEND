import { TestBed } from '@angular/core/testing';

import { LineaproductoServiceService } from './lineaproducto-service.service';

describe('LineaproductoServiceService', () => {
  let service: LineaproductoServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LineaproductoServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
