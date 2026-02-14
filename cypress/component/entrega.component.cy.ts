import { CrearEntregaComponent } from '../../src/app/entrega-components/crear-entrega/crear-entrega.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { ButtonModule } from 'primeng/button';
import { of } from 'rxjs';
import { RepartidorService } from '../../src/app/services/repartidor.service';
import { EntregaService } from '../../src/app/services/entrega.service';
import { ZonaService } from '../../src/app/services/zona.service';
import { AuthservicesService } from '../../src/app/services/authservices.service';
import { ClienteService } from '../../src/app/services/cliente.service';
import { CargaService } from '../../src/app/services/carga.service';
import { BreakpointService } from '../../src/app/services/breakpoint.service';

describe('CrearEntregaComponent.cy.ts - Gestión de Entregas Admin', () => {

  const mockZonas = [
    { id: 1, nombre: 'Zona Centro' },
    { id: 2, nombre: 'Zona Norte' }
  ];

  const mockRepartidores = [
    { id: 10, apellidoNombre: 'Juan Chofer (Centro)', zona: { id: 1 } },
    { id: 20, apellidoNombre: 'Pedro Chofer (Norte)', zona: { id: 2 } }
  ];

  const mockPedidos = [
    { nroPedido: 501, cliente: { zona: { id: 1 } } }, 
    { nroPedido: 502, cliente: { zona: { id: 1 } } },
    { nroPedido: 601, cliente: { zona: { id: 2 } } }  
  ];

  const mockZonaService = { getZonasActivas: () => of({ data: mockZonas }) };
  const mockRepartidorService = { getRepartidoresActivos: () => of({ data: mockRepartidores }) };
  const mockEntregaService = {
    getPedidosPagosSinEntrega: () => of({ data: mockPedidos }),
    save: (data: any) => of({ success: true })
  };
  const mockAuthService = { getUserData: () => ({ role: 'admin' }) };
  const mockClienteService = { getMiPerfil: () => of(null) };
  const mockCargaService = { show: () => {}, hide: () => {} };
  const mockBreakpointService = { isMobile$: of(false) };

  const configMount = {
    imports: [
      NoopAnimationsModule,
      ReactiveFormsModule,
      FormsModule,
      CalendarModule,
      DropdownModule,
      MultiSelectModule,
      ButtonModule
    ],
    providers: [
      { provide: ZonaService, useValue: mockZonaService },
      { provide: RepartidorService, useValue: mockRepartidorService },
      { provide: EntregaService, useValue: mockEntregaService },
      { provide: AuthservicesService, useValue: mockAuthService },
      { provide: ClienteService, useValue: mockClienteService },
      { provide: CargaService, useValue: mockCargaService },
      { provide: BreakpointService, useValue: mockBreakpointService }
    ]
  };

  it('Debería cargar Zonas y Repartidores correctamente en el inicio', () => {
    cy.mount(CrearEntregaComponent, configMount);
    cy.get('h4').should('contain.text', 'Registrar Nueva Entrega');
    
    cy.get('#zona').click();
    cy.get('.p-dropdown-item').should('have.length', 2);
    cy.get('.p-dropdown-item').first().should('contain.text', 'Zona Centro');
  });

  it('Debería filtrar Repartidores y Pedidos al seleccionar una Zona', () => {
    cy.mount(CrearEntregaComponent, configMount);

    cy.get('#zona').click();
    cy.get('.p-dropdown-item').contains('Zona Centro').click();

    cy.get('#repartidor').click();
    cy.get('.p-dropdown-item').should('have.length', 1);
    cy.get('.p-dropdown-item').should('contain.text', 'Juan Chofer');
    cy.get('.p-dropdown-item').click();

    cy.get('#pedidos').click();
    cy.get('.p-multiselect-item').should('have.length', 2);
    cy.get('.p-multiselect-item').contains('501').should('exist');
    cy.get('.p-multiselect-item').contains('502').should('exist');
  });

  it('Debería permitir seleccionar múltiples pedidos usando MultiSelect', () => {
    cy.mount(CrearEntregaComponent, configMount);

    cy.get('#zona').click();
    cy.get('.p-dropdown-item').contains('Zona Centro').click();

    cy.get('#pedidos').click();
    cy.get('.p-multiselect-item').contains('501').click();
    cy.get('.p-multiselect-item').contains('502').click();

    cy.get('body').click(0, 0);

    cy.get('.p-multiselect-token').should('have.length', 2);
  });

  it('Debería validar que el formulario no se guarde si falta el repartidor', () => {
    const saveSpy = cy.spy(mockEntregaService, 'save').as('saveSpy');

    cy.mount(CrearEntregaComponent, configMount);

    cy.get('#zona').click();
    cy.get('.p-dropdown-item').contains('Zona Centro').click();

    cy.get('button[type="submit"]').click();

    cy.get('@saveSpy').should('not.have.been.called');
  });

});