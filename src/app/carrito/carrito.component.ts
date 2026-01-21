import { Component, Injectable, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { PedidoState } from '../states/pedido.state';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import _ from 'lodash';
import { Pedido } from '../../../src/app/models/pedido';
import { Cliente } from '../../../src/app/models/cliente';
import { ClienteService } from '../../../src/app/services/cliente.service';
import { PedidoServiceService } from '../../../src/app/services/pedido-service.service';
import { Router } from '@angular/router';
import { CargaService } from '../services/carga.service';

@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrl: './carrito.component.css'
})
export class CarritoComponent implements OnInit {

  @Select(PedidoState.getPedido) pedido$!: Observable<Pedido>;
  pedidoSelectSnapShot!: Pedido;
  clientes: Cliente[] = [];
  clienteSelected!: Cliente;
  fechaSelected!: Date;

  constructor(
    private store: Store,
    private apiService: ClienteService,
    private router: Router,
    private _pedidoService: PedidoServiceService,
    private cargaService: CargaService
  ) {}

  ngOnInit(): void {
    this.llenarData();
    this.pedidoSelectSnapShot = _.cloneDeep(this.store.selectSnapshot(PedidoState.getPedido));
  }

  setearCliente(cliente: Cliente) {
    this.pedidoSelectSnapShot.cliente = cliente;
  }

  llenarData() {
    this.cargaService.show();
    this.apiService.getClientesActivos().subscribe((resp: any) => {
      const list: Cliente[] = resp.data || resp;

      this.clientes = list.map((cliente: Cliente) => ({
        id: cliente.id,
        apellidoNombre: cliente.apellidoNombre,
        telefono: cliente.telefono,
        email: cliente.email,
        domicilio: cliente.domicilio,
        cuit: cliente.cuit,
        disponible: cliente.disponible,
        zona: cliente.zona
      }));

      this.cargaService.hide();
    }, () => {
      this.cargaService.hide();
    });
  }

  pagar() {
    this.cargaService.show();
    this.pedidoSelectSnapShot.fecha = this.fechaSelected;

    this._pedidoService.guardar(this.pedidoSelectSnapShot).subscribe(() => {
      this.cargaService.hide();
      Swal.fire({
        title: "Pedido guardado",
        text: "",
        icon: "success"
      });
      this.router.navigate(['pedidos']);
    }, () => {
      this.cargaService.hide();
      Swal.fire({
        title: "No se pudo guardar el pedido",
        text: "",
        icon: "error"
      });
    });
  }
}
