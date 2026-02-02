import { RouterModule, Routes } from '@angular/router';
import { ClientesComponent } from './cliente-components/clientes/clientes.component';
import { CrearClientesComponent } from './cliente-components/crear-clientes/crear-clientes.component';
import { TipoproductoComponent } from './producto-components/tipoproducto/tipoproducto.component';
import { ProductosComponent } from './producto-components/productos/productos.component';
import { RepartidorComponent } from './repartidor-components/repartidor/repartidor.component';
import { TipopagoComponent } from './pago-components/tipopago/tipopago.component';
import { CrearTipoPagoComponent } from './pago-components/crear-tipopago/crear-tipopago.component';
import { HomeComponentComponent } from './home-component/home-component.component';
import { PedidosComponent } from './pedidos/pedidos.component';
import { CarritoComponent } from './carrito/carrito.component';

import { NgModule } from '@angular/core';
import { EntregaComponent } from './entrega-components/entrega/entrega.component';
import { CrearEntregaComponent } from './entrega-components/crear-entrega/crear-entrega.component';
import { PagoComponent } from './pago-components/pago/pago.component';
import { CrearPagoComponent } from './pago-components/crear-pago/crear-pago.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './guards.ts/authguard';
import { ZonasComponent } from './zona/zonas/zonas.component';
import { CrearZonasComponent } from './zona/crear-zonas/crear-zonas.component';
import { DetallePedidoComponent } from './detalle-pedido/detalle-pedido.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponentComponent },
  { path: "clientes", component: ClientesComponent, canActivate: [AuthGuard] },
  { path: "crearTipoProducto", component: TipoproductoComponent, canActivate: [AuthGuard] },
  { path: "productos", component: ProductosComponent , canActivate: [AuthGuard]},
  { path: "entregas", component: EntregaComponent , canActivate: [AuthGuard]},
  { path: "crearEntrega", component: CrearEntregaComponent , canActivate: [AuthGuard]},
  { path: "pago", component: PagoComponent , canActivate: [AuthGuard]},
  { path: "crearPago", component: CrearPagoComponent , canActivate: [AuthGuard]},
  { path: "repartidores", component: RepartidorComponent , canActivate: [AuthGuard]},
  { path: "tiposDePago", component: TipopagoComponent , canActivate: [AuthGuard]},
  { path: "crearTipoPago", component: CrearTipoPagoComponent , canActivate: [AuthGuard]},
  { path: "zonas", component: ZonasComponent , canActivate: [AuthGuard] },
  { path: "crearZonas", component: CrearZonasComponent, canActivate: [AuthGuard] },
  { path: "carrito", component: CarritoComponent , canActivate: [AuthGuard]},
  { path: "pedidos", component: PedidosComponent , canActivate: [AuthGuard]},
  { path: "login", component: LoginComponent },
  { path: "detallePedido", component: DetallePedidoComponent }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
