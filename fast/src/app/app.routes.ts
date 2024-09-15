import { Routes } from '@angular/router';
import { ClientesComponent } from './clientes/clientes.component';
import { CrearClientesComponent } from './crear-clientes/crear-clientes.component';
import { TipoproductoComponent } from './tipoproducto/tipoproducto.component';
import { ProductosComponent } from './productos/productos.component';
import { RepartidorComponent } from './repartidor/repartidor.component';

export const routes: Routes = [
  { path: "clientes", component: ClientesComponent },
  { path: "crearclientes", component: CrearClientesComponent },
  { path: "crearTipoProducto", component: TipoproductoComponent },
  { path: "productos", component: ProductosComponent },
  { path: "repartidores", component: RepartidorComponent }
];
