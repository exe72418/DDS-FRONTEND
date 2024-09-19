import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipopagoComponent } from './tipopago.component';

describe('TipopagoComponent', () => {
  let component: TipopagoComponent;
  let fixture: ComponentFixture<TipopagoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TipopagoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TipopagoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
