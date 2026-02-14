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

## Testing Unitarios por componentes 
El proyecto cuenta con unos test de componentes automatizados desarrollados con Cypress. 
Los mismos se pueden encontrar en **\cypress\component**

### Cobertura de los tests

**login.component.cy.ts:** Valida qe se muestre el loguin, la interacción con los campos de entrada y la lógica de cambio entre los formularios de ingreso y registro del mismo.
**home.component.cy.ts:** Verifica que se muestre el catálogo de productos y la lógica de control de stock, validando que la interfaz responda correctamente al flujo de compra y a los límites de inventario definidos.
**pago.component.cy.ts:** Evalúa la integración de formularios reactivos y la lógica de selección de pagos, asegurandose que los montos se actualicen solos al elegir un pedido y que el pago se guarde bien si se cargó la información correspondiente.
**entrega.component.cy.ts:** Valida que al elegir una zona se filtren de forma correcta los repartidores y pedidos disponibles, y que no te deje guardar la entrega si no hay un repartidor asignado.


### Pre-requisitos para ejecutarlos
Asegúrese de que el Backend y el Frontend estén corriendo en su entorno local.

1. Abrir una nueva consola y escribir:
``` bash
npm install cypress --save-dev
```
2. Una vez terminado el anterior, ejecutar:
``` bash
npx cypress open
```
3. Seleccionar **Component Testing**
4. Elegir el navegador
5. Hacer clic en los archivos e ir probando.

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
