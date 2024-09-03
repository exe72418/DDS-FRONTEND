import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearTipoProdComponent } from './crear-tipo-prod.component';

describe('CrearTipoProdComponent', () => {
  let component: CrearTipoProdComponent;
  let fixture: ComponentFixture<CrearTipoProdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearTipoProdComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearTipoProdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
