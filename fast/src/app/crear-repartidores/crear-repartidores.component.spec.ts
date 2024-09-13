import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearRepartidoresComponent } from './crear-repartidores.component';

describe('CrearRepartidoresComponent', () => {
  let component: CrearRepartidoresComponent;
  let fixture: ComponentFixture<CrearRepartidoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearRepartidoresComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearRepartidoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
