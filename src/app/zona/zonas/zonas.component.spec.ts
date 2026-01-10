import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZonasComponent } from './zonas.component';

describe('ZonaComponent', () => {
  let component: ZonasComponent;
  let fixture: ComponentFixture<ZonasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ZonasComponent] // A veces es declarations en lugar de imports si no es standalone
    })
    .compileComponents();

    fixture = TestBed.createComponent(ZonasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});