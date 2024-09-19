import { Routes } from '@angular/router';
import { ClientesComponent } from './clientes/clientes.component';
import { CrearClientesComponent } from './crear-clientes/crear-clientes.component';
import { TipoproductoComponent } from './tipoproducto/tipoproducto.component';
import { ProductosComponent } from './productos/productos.component';
import { RepartidorComponent } from './repartidor/repartidor.component';
import { TipopagoComponent } from './tipopago/tipopago.component';
import { CrearTipoPagoComponent } from  './crear-tipopago/crear-tipopago.component';

export const routes: Routes = [
  { path: "clientes", component: ClientesComponent },
  { path: "crearTipoProducto", component: TipoproductoComponent },
  { path: "productos", component: ProductosComponent },
  { path: "repartidores", component: RepartidorComponent },
  { path: "tiposDePago", component: TipopagoComponent },
  { path: "crearTipoPago", component: CrearTipoPagoComponent }
];
