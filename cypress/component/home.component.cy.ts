import { HomeComponentComponent } from '../../src/app/home-component/home-component.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { RouterTestingModule } from '@angular/router/testing';
import { Store } from '@ngxs/store';
import { of } from 'rxjs';
import { ProductosServiceService } from '../../src/app/services/productos-service.service';
import { CargaService } from '../../src/app/services/carga.service';
import { TipoproductoService } from '../../src/app/services/tipoproducto.service';
import { BreakpointService } from '../../src/app/services/breakpoint.service';

describe('HomeComponent.cy.ts', () => {

  const mockProductos = [
    {
      codigo: 1,
      descripcion: 'Coca Cola 1.5L',
      precio: 1500,
      stock: 10,
      producto: { codigo: 1 }
    },
    {
      codigo: 2,
      descripcion: 'Papas Lays',
      precio: 1200,
      stock: 2, 
      producto: { codigo: 2 }
    }
  ];

  const mockTiposProducto = {
    data: [
      { id: 1, nombre: 'Bebidas', disponible: true },
      { id: 2, nombre: 'Snacks', disponible: true }
    ]
  };

  const mockStore = {
    selectSnapshot: () => null,
    dispatch: () => of(null)
  };

  const mockProductosService = {
    getProductosActivos: () => of(mockProductos),
    getProductosByFilters: () => of({ data: mockProductos })
  };

  const mockCargaService = { show: () => {}, hide: () => {} };
  const mockTipoProductoService = { getTiposDeProductoActivos: () => of(mockTiposProducto) };
  const mockBreakpointService = { isMobile$: of(false) };
  const configMount = {
    imports: [
      NoopAnimationsModule,
      FormsModule,
      InputTextModule,
      ButtonModule,
      CardModule,
      DropdownModule,
      RouterTestingModule
    ],
    providers: [
      { provide: Store, useValue: mockStore },
      { provide: ProductosServiceService, useValue: mockProductosService },
      { provide: CargaService, useValue: mockCargaService },
      { provide: TipoproductoService, useValue: mockTipoProductoService },
      { provide: BreakpointService, useValue: mockBreakpointService }
    ]
  };

  it('Debería mostrar la lista de productos correctamente', () => {
    cy.mount(HomeComponentComponent, configMount);

    cy.get('.product-card-wrapper').should('have.length', 2);

    cy.get('.product-card-wrapper').first().within(() => {
      cy.get('h4').should('contain.text', 'Coca Cola 1.5L');
      cy.get('.prod-price').should('contain.text', '$1,500.00');
      cy.contains('button', 'Comprar').should('exist');
    });
  });

  it(' Debería permitir comprar y bloquear el botón (+) al alcanzar el Stock límite', () => {
    cy.mount(HomeComponentComponent, configMount);

    cy.get('.product-card-wrapper').eq(1).within(() => {
      
      cy.get('h4').should('contain.text', 'Papas Lays'); 

      cy.contains('button', 'Comprar').click();
      cy.contains('Cantidad: 1').should('exist');

      cy.get('.p-button-success').click(); 
      cy.contains('Cantidad: 2').should('exist');

      cy.get('.p-button-success').should('be.disabled');
      
      cy.get('.p-button-danger').should('not.be.disabled');
    });
  });

});