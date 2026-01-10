import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearZonasComponent } from './crear-zonas.component';

describe('CrearZonasComponent', () => {
  let component: CrearZonasComponent;
  let fixture: ComponentFixture<CrearZonasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CrearZonasComponent] // Recuerda usar declarations si no es standalone
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearZonasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});