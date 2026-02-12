describe('Suite de Pruebas: Supermercado Fast', () => {

  // --- CONFIGURACIÓN DE DATOS ---
  const USUARIO_CLIENTE = 'BrunoCliente';
  const PASS_CLIENTE = 'BrunoCliente12345';
  const USUARIO_ADMIN = 'Bruno123';
  const PASS_ADMIN = 'Bruno123';

  const PROD_1 = 'Gaseosa Cola 2.25L';
  const PROD_2 = 'Asado de Novillo x1kg';
  const PROD_3 = 'Papas Fritas Prefritas 1kg';

  const CATEGORIA_LIMPIEZA = 'Limpieza';
  const PROD_LAVANDINA = 'Lavandina Clásica 1L';
  const PROD_DETERGENTE = 'Detergente Ultra 500ml';

  const ZONA_TARGET = 'Este';
  const REPARTIDOR_TARGET = 'Pérez, Hugo';
  const METODO_PAGO_1 = 'Efectivo en Pesos';
  const METODO_PAGO_2 = 'Transferencia / QR';

  // --- FUNCIONES AUXILIARES ---
  const esperarCarga = () => {
    cy.get('.carga-overlay', { timeout: 15000 }).should('not.exist');
    cy.wait(500);
  };

  const resetearBuscador = () => {
    cy.get('input[placeholder="Buscar por nombre"]').clear().type('{enter}').blur();
    esperarCarga();
  };

  beforeEach(() => {
    cy.window().then((win) => win.localStorage.clear());
    cy.visit('http://localhost:4200/home');
  });

  it('Debería realizar el flujo completo: 2 Pedidos -> Diferentes Pagos -> Entrega Admin', () => {
    
    // =========================================================
    // 1. LOGIN CLIENTE
    // =========================================================
    cy.log('INICIANDO LOGIN');
    cy.get('.icon-container[title="Usuario"]').click({ force: true });
    cy.get('input[formControlName="username"]').type(USUARIO_CLIENTE);
    cy.get('input[formControlName="password"]').type(PASS_CLIENTE);
    cy.get('button[type="submit"]').click();
    
    cy.get('body').then(($body) => {
      if ($body.find('.swal2-confirm').length > 0) {
        cy.get('.swal2-confirm').click({ force: true });
      }
    });
    esperarCarga();

    // =========================================================
    // 2. ARMANDO PEDIDO 1
    // =========================================================
    cy.log('PEDIDO 1');
    cy.get('input[placeholder="Buscar por nombre"]').clear().type(`${PROD_1}{enter}`).blur();
    esperarCarga();
    cy.contains('.product-card-wrapper', PROD_1).as('card1');
    cy.get('@card1').contains('button', 'Comprar').click({ force: true });
    cy.get('@card1').find('.pi-plus').click({ force: true });
    esperarCarga();

    resetearBuscador();
    cy.get('input[placeholder="Buscar por nombre"]').type(`${PROD_2}{enter}`).blur();
    esperarCarga();
    cy.contains('.product-card-wrapper', PROD_2).as('card2');
    cy.get('@card2').contains('button', 'Comprar').click({ force: true });
    cy.get('@card2').find('.pi-plus').click({ force: true });
    esperarCarga();

    resetearBuscador();
    cy.get('input[placeholder="Buscar por nombre"]').type(`${PROD_3}{enter}`).blur();
    esperarCarga();
    cy.contains('.product-card-wrapper', PROD_3).as('card3');
    cy.get('@card3').contains('button', 'Comprar').click({ force: true });
    esperarCarga();

    // CONFIRMAR Y CAPTURAR ID 1
    cy.get('button[routerLink="/carrito"]').click({ force: true });
    esperarCarga();
    cy.contains('button', 'Confirmar e Ir a Pagar').click({ force: true });
    
    // Aumentamos el tiempo de espera para que aparezca el ID real del pedido
    cy.get('p-dropdown[formControlName="pedido"] .p-dropdown-label', { timeout: 10000 })
      .should('not.contain', 'Seleccione')
      .invoke('text').then((id) => {
        cy.wrap(id.trim()).as('idPedido1');
        cy.log(`ID CAPTURADO 1: ${id.trim()}`);
      });

    cy.get('p-dropdown[formControlName="tipoPago"] > .p-dropdown').click({ force: true });
    cy.contains('.p-dropdown-item', METODO_PAGO_1).click({ force: true });
    cy.contains('button', 'Guardar Pago').click({ force: true });
    cy.get('.swal2-confirm').click({ force: true });
    esperarCarga();

    // =========================================================
    // 3. ARMANDO PEDIDO 2
    // =========================================================
    cy.log('PEDIDO 2');
    cy.get('.navbar-brand').click(); 
    esperarCarga();

    cy.get('p-dropdown[id="tipodeprod"] > .p-dropdown').click({ force: true });
    cy.contains('.p-dropdown-item', CATEGORIA_LIMPIEZA).click({ force: true });
    esperarCarga();

    cy.contains('.product-card-wrapper', PROD_LAVANDINA).as('cardL');
    cy.get('@cardL').contains('button', 'Comprar').click({ force: true });
    esperarCarga();

    cy.contains('.product-card-wrapper', PROD_DETERGENTE).as('cardD');
    cy.get('@cardD').contains('button', 'Comprar').click({ force: true });
    cy.get('@cardD').find('.pi-plus').click({ force: true });
    esperarCarga();

    // CONFIRMAR Y CAPTURAR ID 2
    cy.get('button[routerLink="/carrito"]').click({ force: true });
    esperarCarga();
    cy.contains('button', 'Confirmar e Ir a Pagar').click({ force: true });
    
    cy.get('p-dropdown[formControlName="pedido"] .p-dropdown-label', { timeout: 10000 })
      .should('not.contain', 'Seleccione')
      .invoke('text').then((id) => {
        cy.wrap(id.trim()).as('idPedido2');
        cy.log(`ID CAPTURADO 2: ${id.trim()}`);
      });

    cy.get('p-dropdown[formControlName="tipoPago"] > .p-dropdown').click({ force: true });
    cy.contains('.p-dropdown-item', METODO_PAGO_2).click({ force: true });
    cy.contains('button', 'Guardar Pago').click({ force: true });
    cy.get('.swal2-confirm').click({ force: true });
    esperarCarga();

    // =========================================================
    // 4. ADMIN - ENTREGA
    // =========================================================
    cy.log('CAMBIO A ADMIN');
    cy.get('.icon-container[title="Usuario"]').click({ force: true });
    cy.contains('button', 'Cerrar Sesión').click({ force: true });
    
    cy.get('.icon-container[title="Usuario"]').click({ force: true });
    cy.get('input[formControlName="username"]').clear().type(USUARIO_ADMIN);
    cy.get('input[formControlName="password"]').clear().type(PASS_ADMIN);
    cy.get('button[type="submit"]').click();
    cy.get('.swal2-confirm').click({ force: true });
    esperarCarga();

    cy.get('.navbar-nav').contains('a', 'Entregas').click({ force: true });
    esperarCarga();
    cy.contains('button', 'Nuevo').click({ force: true });
    
    cy.get('p-dropdown[formControlName="zona"] > .p-dropdown').click({ force: true });
    cy.contains('.p-dropdown-item', ZONA_TARGET).click({ force: true });
    esperarCarga();

    cy.get('p-dropdown[formControlName="repartidor"] > .p-dropdown').click({ force: true });
    cy.contains('.p-dropdown-item', REPARTIDOR_TARGET).click({ force: true });

    // SELECCIÓN DE MULTISELECT
    cy.get('@idPedido1').then((id1) => {
      cy.get('@idPedido2').then((id2) => {
        cy.get('p-multiselect[formControlName="pedidos"] > .p-multiselect').click({ force: true });
        cy.wait(1000); // Esperamos a que la lista se cargue
        
        // Buscamos los pedidos por texto exacto
        cy.get('.p-multiselect-item').contains(new RegExp(`^${id1}$`)).click({ force: true });
        cy.get('.p-multiselect-item').contains(new RegExp(`^${id2}$`)).click({ force: true });

        cy.get('body').click(0,0, { force: true });
      });
    });

    cy.contains('button', 'Guardar Entrega').click({ force: true });
    cy.get('.swal2-title').should('contain', 'Guardado');

    // =========================================================
    // 5. CARTEL FINAL
    // =========================================================
    cy.document().then((doc) => {
      const banner = doc.createElement('div');
      banner.setAttribute('style', 'position:fixed; top:50%; left:50%; transform:translate(-50%,-50%); background:#22c55e; color:white; padding:40px; border-radius:20px; z-index:9999; font-size:30px; text-align:center; box-shadow: 0 10px 30px rgba(0,0,0,0.5); font-family:sans-serif;');
      banner.innerHTML = '¡TEST EXITOSO!<br><span style="font-size:18px">2 Pedidos Entregados (Efectivo y Transferencia)</span>';
      doc.body.appendChild(banner);
    });
    cy.wait(5000);
  });
});