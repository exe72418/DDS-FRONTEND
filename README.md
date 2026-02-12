# Fast

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.1.1.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

## Testing E2E (End-to-End)
El proyecto cuenta con una prueba automatizada desarrollada con Cypress. Valida el Flujo Crítico de Negocio, simulando la interacción real de un usuario y un administrador.
El mismo se puede encontrar en **\cypress\e2e\flujo_completo_compra.cy.ts**

### Cobertura del Test
**1. Login de Cliente:** Ingreso con credenciales válidas.
**2. Búsqueda y Filtrado:** Uso del buscador y filtros por categoría.
**3. Carrito de Compras:** Agregado de múltiples productos con distintas cantidades.
**4. Checkout:** Confirmación del pedido y persistencia de datos.
**5. Procesamiento de Pagos:** Pago con distintos medios (Efectivo y Transferencia/QR).
**6. Cambio de Roles:** Logout del cliente y Login como Administrador.
**7. Continuidad del negocio:** Asignación de Zona, Repartidor y unificando múltiples pedidos pendientes en una misma entrega.

### Pre-requisitos para ejecutar el Test
Asegúrese de que el Backend y el Frontend estén corriendo en su entorno local.

1. Abrir una nueva consola y escribir:
``` bash
npx cypress open
```
2. Seleccionar **E2E Testing.**
3. Elegir el navegador
4. Hacer clic en el archivo **flujo_completo_compra.cy.ts**
