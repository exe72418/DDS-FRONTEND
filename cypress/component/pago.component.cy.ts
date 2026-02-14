import { CrearPagoComponent } from '../../src/app/pago-components/crear-pago/crear-pago.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { of } from 'rxjs';
import { TipopagoService } from '../../src/app/services/tipopago.service';
import { PagoService } from '../../src/app/services/pago.service';
import { LineaProductoService } from '../../src/app/services/lineaproducto-service.service';
import { AuthservicesService } from '../../src/app/services/authservices.service';
import { CargaService } from '../../src/app/services/carga.service';
import { BreakpointService } from '../../src/app/services/breakpoint.service';

describe('CrearPagoComponent.cy.ts', () => {

  const mockTiposPago = [
    { id: 1, nombre: 'Efectivo', disponible: true },
    { id: 2, nombre: 'Tarjeta de Crédito', disponible: true }
  ];

  const mockPedidos = [
    { nroPedido: 101, total: 5000, lineas: [] },
    { nroPedido: 102, total: 3000, lineas: [] }
  ];

  const mockTipopagoService = {
    getTiposDePagoActivos: () => of({ data: mockTiposPago })
  };

  const mockPagoService = {
    getPedidosSinPago: () => of({ data: mockPedidos }),
    getMisPedidosSinPago: () => of({ data: mockPedidos }),
    save: (pago: any) => of({ success: true })
  };

  const mockAuthService = {
    getUserData: () => ({ role: 'admin' }) 
  };

  const mockCargaService = { show: () => {}, hide: () => {} };
  const mockLineaService = { getLineasByPedidoId: () => of([]) };
  const mockBreakpointService = { isMobile$: of(false) };

  const configMount = {
    imports: [
      NoopAnimationsModule,
      ReactiveFormsModule,
      FormsModule,
      CalendarModule,
      DropdownModule,
      CardModule,
      ButtonModule
    ],
    providers: [
      { provide: TipopagoService, useValue: mockTipopagoService },
      { provide: PagoService, useValue: mockPagoService },
      { provide: LineaProductoService, useValue: mockLineaService },
      { provide: AuthservicesService, useValue: mockAuthService },
      { provide: CargaService, useValue: mockCargaService },
      { provide: BreakpointService, useValue: mockBreakpointService }
    ]
  };

  it('Debería mostrar el formulario incompleto inicialmente', () => {
    cy.mount(CrearPagoComponent, configMount);

    cy.get('h4').should('contain.text', 'Registrar Nuevo Pago');

    cy.get('button[label="Guardar Pago"]').should('exist');
  });

  it('Debería cargar los combos y permitir seleccionar Pedido y Tipo de Pago', () => {
    cy.mount(CrearPagoComponent, configMount);

    cy.get('#tipoPago').click();
    cy.get('.p-dropdown-item').contains('Tarjeta de Crédito').click();

    cy.get('#pedido').click();
    cy.get('.p-dropdown-item').contains('101').click();

    cy.get('.resumen-card').should('be.visible');
    cy.get('.precio-final').should('contain.text', '5,000');
  });

  it('Debería llamar al servicio de guardado al completar el formulario', () => {
    const saveSpy = cy.spy(mockPagoService, 'save').as('saveSpy');

    cy.mount(CrearPagoComponent, configMount);

    cy.get('#tipoPago').click();
    cy.get('.p-dropdown-item').contains('Efectivo').click();

    cy.get('#pedido').click();
    cy.get('.p-dropdown-item').contains('102').click();

    cy.get('button[type="submit"]').click();

    cy.get('@saveSpy').should('have.been.called');
  });

});