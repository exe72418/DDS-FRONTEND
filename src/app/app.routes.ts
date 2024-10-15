import { RouterModule, Routes } from '@angular/router';
import { ClientesComponent } from './cliente-components/clientes/clientes.component';
import { CrearClientesComponent } from './cliente-components/crear-clientes/crear-clientes.component';
import { TipoproductoComponent } from './producto-components/tipoproducto/tipoproducto.component';
import { ProductosComponent } from './producto-components/productos/productos.component';
import { RepartidorComponent } from './repartidor-components/repartidor/repartidor.component';
import { TipopagoComponent } from './pago-components/tipopago/tipopago.component';
import { CrearTipoPagoComponent } from  './pago-components/crear-tipopago/crear-tipopago.component';
import { HomeComponentComponent } from '../../fast/src/app/home-component/home-component.component';
import { PedidosComponent } from '../../fast/src/app/pedidos/pedidos.component';
import { CarritoComponent } from '../../fast/src/app/carrito/carrito.component';
import { NgModule } from '@angular/core';

export const routes: Routes = [
  { path: 'home', component: HomeComponentComponent },
  { path: "clientes", component: ClientesComponent },
  { path: "crearTipoProducto", component: TipoproductoComponent },
  { path: "productos", component: ProductosComponent },
  { path: "repartidores", component: RepartidorComponent },
  { path: "tiposDePago", component: TipopagoComponent },
  { path: "crearTipoPago", component: CrearTipoPagoComponent },
  { path: "carrito", component: CarritoComponent },
  { path: "pedidos", component: PedidosComponent },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
