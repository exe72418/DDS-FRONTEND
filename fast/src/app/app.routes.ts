import { Routes } from '@angular/router';
import { ClientesComponent } from './clientes/clientes.component';
import { CrearClientesComponent } from './crear-clientes/crear-clientes.component';

export const routes: Routes = [
  {path: "clientes", component: ClientesComponent},
  {path: "crearclientes", component: CrearClientesComponent}
];
