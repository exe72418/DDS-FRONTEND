import { LoginComponent } from '../../src/app/login/login.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { DividerModule } from 'primeng/divider';
import { of } from 'rxjs';
import { AuthservicesService } from '../../src/app/services/authservices.service';
import { ZonaService } from '../../src/app/services/zona.service';
import { ClienteService } from '../../src/app/services/cliente.service';
import { BreakpointService } from '../../src/app/services/breakpoint.service';
import { CargaService } from '../../src/app/services/carga.service';

describe('LoginComponent.cy.ts', () => {

  const mockAuthService = {
    isAuthenticated: () => false,
    getUserData: () => null,
    login: () => of({ token: 'fake-token-123' })
  };

  const mockZonaService = {
    getZonasActivas: () => of({ data: [] })
  };

  const mockClienteService = {
    getMiPerfil: () => of({})
  };

  const mockBreakpointService = {
    isMobile$: of(false)
  };

  const mockCargaService = {
    show: () => console.log('Carga show'),
    hide: () => console.log('Carga hide')
  };

  const configMount = {
    imports: [
      NoopAnimationsModule, 
      ReactiveFormsModule,
      FormsModule,
      InputTextModule,
      ButtonModule,
      RouterTestingModule,
      ToastModule,
      MatDialogModule,
      DropdownModule,
      DividerModule
    ],
    providers: [
      MessageService,
      { provide: AuthservicesService, useValue: mockAuthService },
      { provide: ZonaService, useValue: mockZonaService },
      { provide: ClienteService, useValue: mockClienteService },
      { provide: BreakpointService, useValue: mockBreakpointService },
      { provide: CargaService, useValue: mockCargaService },
      {
        provide: MatDialogRef,
        useValue: { close: () => console.log('Dialog cerrado desde el Test') }
      }
    ]
  };

  it('Debería abrirse y mostrar el formulario de Login', () => {
    cy.mount(LoginComponent, configMount);
    cy.get('h2').should('contain.text', 'Iniciar Sesión');
    cy.get('input[formControlName="username"]').should('exist');
    cy.get('input[formControlName="password"]').should('exist');
    cy.get('button[type="submit"]').should('exist').and('contain.text', 'Ingresar');
  });

  it('Debería permitir escribir usuario y contraseña', () => {
    cy.mount(LoginComponent, configMount);
    cy.get('input[formControlName="username"]').type('BrunoTest').should('have.value', 'BrunoTest');
    cy.get('input[formControlName="password"]').type('123456').should('have.value', '123456');
  });

  it('Debería cambiar a Registro al hacer clic en "Crear una cuenta"', () => {
    cy.mount(LoginComponent, configMount);
    cy.contains('button', 'Crear una cuenta').click();
    cy.get('h2').should('contain.text', 'Crear Cuenta');
    cy.get('input[formControlName="cuit"]').should('exist');
  });

});