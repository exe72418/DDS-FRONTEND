# FRONTEND Trabajo Práctico de Desarrollo de Software - Supermercado FAST

## Integrantes

| Legajo | Apellido y Nombres |
|:-------|:-------------------|
| 47048 | Zarate, Exequiel |
| 47094 | Martinez, Bruno |
| 43814 | Aieta, Federico |
| 42775 | Reinoso, Alfredo |

## Repositorios

* **Frontend App:** [https://github.com/Facultad-utn-desarrollo/DDS-FRONTEND/tree/stable](https://github.com/Facultad-utn-desarrollo/DDS-FRONTEND/tree/stable)
* **Backend App:** [https://github.com/Facultad-utn-desarrollo/DDS-BACKEND/tree/stable](https://github.com/Facultad-utn-desarrollo/DDS-BACKEND/tree/stable)

---

## 1. Propuesta

### Descripción
La empresa de nuestro trabajo es un supermercado "FAST" que busca desarrollar una plataforma web para que los clientes puedan realizar pedidos de forma online. El sistema administra todo el ciclo de venta, desde la selección de productos hasta la entrega (delivery) y el pago, diferenciando roles entre Clientes y Administradores.

[Hacer click aquí para acceder al modelo, alcances, etc.](https://github.com/BrunoMar99/tp/blob/fc37bd3851383300b3631d4459443cda8e70dfed/proposal.md)

---

## 2. Información de la Aplicación

- **Node.js:** El proyecto requiere Node.js v20 o superior para ejecutar el servidor backend y las herramientas de desarrollo del frontend.

- **Framework:** Toda la aplicación está construida a partir del framework Angular 18.1.

- **Gestor de Estado:** NGXS (v18.1.1) almacena la información centralizada, como los datos del pedido en curso y del usuario.

- **Librería UI Principal:** PrimeNG (v17.18.9) la librería de diseño principal que provee los componentes visuales listos para usar.

- **Librería UI Secundaria:** Angular Material (v18.1.4) y el CDK (v18.1.4) son un conjunto de herramientas y componentes visuales secundarios que complementan la interfaz.

- **Testing E2E / Componentes:** Cypress (v15.10.0) como motor de pruebas moderno utilizado para aislar los componentes y simular la interacción real de los usuarios en el navegador.

- **Lenguaje:** TypeScript (v5.5.2) que le suma tipado estricto a JavaScript para atrapar errores antes de ejecutar el código.

- **Gestor de paquetes:** pnpm (v9.0.4) para instalar todas las dependencias del frontend.

---

## 3. Instrucciones de Instalación

Sigue estos pasos para correr el frontend en tu entorno local:

### a. Clonar el repositorio
```bash
git clone https://github.com/Facultad-utn-desarrollo/DDS-FRONTEND.git
```
```bash
cd DDS-FRONTEND
```
### b. Instalar dependencias
```bash
npm install
```
### c. Ejecutar la aplicación

Para entorno de desarrollo:

```bash
npm run ng serve
```
La aplicación estará disponible localmente en http://localhost:4200.

---

## 4. Datos de Prueba (Testing)
Para facilitar la corrección y pruebas de los roles, se proporcionan las siguientes credenciales:

**Rol: CLIENTE**
* **Usuario:** BrunoCliente
* **Contraseña:** BrunoCliente12345

**Rol: ADMINISTRADOR**
* **Usuario:** Bruno123
* **Contraseña:** Bruno123

---

## 5. Deploy

El proyecto se encuentra desplegado y funcional en los siguientes enlaces:

* **Frontend (Netlify):** [https://frontfast.netlify.app/](https://frontfast.netlify.app/)

* **Backend (Render):** [https://dds-backend-a.onrender.com/](https://dds-backend-a.onrender.com/)

**Aviso Importante: Debido a las limitaciones del plan gratuito en Render, el servidor entra en modo suspensión por inactividad. La primera petición puede demorar unos 60 segundos en responder mientras el servicio se reactiva.**

---

## 6. Testing Unitarios por componentes 
El proyecto cuenta con unos test de componentes automatizados desarrollados con Cypress. 
Los mismos se pueden encontrar en **\cypress\component**

### Cobertura de los tests

- **login.component.cy.ts:** Valida qe se muestre el loguin, la interacción con los campos de entrada y la lógica de cambio entre los formularios de ingreso y registro del mismo.
- **home.component.cy.ts:** Verifica que se muestre el catálogo de productos y la lógica de control de stock, validando que la interfaz responda correctamente al flujo de compra y a los límites de inventario definidos.
- **pago.component.cy.ts:** Evalúa la integración de formularios reactivos y la lógica de selección de pagos, asegurandose que los montos se actualicen solos al elegir un pedido y que el pago se guarde bien si se cargó la información correspondiente.
- **entrega.component.cy.ts:** Valida que al elegir una zona se filtren de forma correcta los repartidores y pedidos disponibles, y que no te deje guardar la entrega si no hay un repartidor asignado.

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

## 7. Testing E2E (End-to-End)
El proyecto cuenta con una prueba automatizada desarrollada con Cypress. Valida el Flujo Crítico de Negocio, simulando la interacción real de un usuario y un administrador.
El mismo se puede encontrar en **\cypress\e2e\flujo_completo_compra.cy.ts**

### Cobertura del Test
1. **Login de Cliente:** Ingreso con credenciales válidas.

2. **Búsqueda y Filtrado:** Uso del buscador y filtros por categoría.

3. **Carrito de Compras:** Agregado de múltiples productos con distintas cantidades.

4. **Checkout:** Confirmación del pedido y persistencia de datos.

5. **Procesamiento de Pagos:** Pago con distintos medios (Efectivo y Transferencia/QR).

6. **Cambio de Roles:** Logout del cliente y Login como Administrador.

7. **Continuidad del negocio:** Asignación de Zona, Repartidor y unificando múltiples pedidos pendientes en una misma entrega.

### Pre-requisitos para ejecutar el Test
Asegúrese de que el Backend y el Frontend estén corriendo en su entorno local.

1. Abrir una nueva consola y escribir:
``` bash
npx cypress open
```
2. Seleccionar **E2E Testing.**
3. Elegir el navegador
4. Hacer clic en el archivo **flujo_completo_compra.cy.ts**

---

## 8. Playlist de Vistas
(En esta sección se agregarán próximamente los videos demostrativos del flujo de Usuario y Administrador)
