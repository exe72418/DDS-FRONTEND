import { Component, Injectable, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { PedidoState, SetPedidosAction } from '../states/pedido.state'; 
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import _ from 'lodash';
import { Pedido } from '../../../src/app/models/pedido';
import { Cliente } from '../../../src/app/models/cliente';
import { ClienteService } from '../../../src/app/services/cliente.service';
import { PedidoServiceService } from '../../../src/app/services/pedido-service.service';
import { Router } from '@angular/router';
import { CargaService } from '../services/carga.service';
import { PagoService } from '../services/pago.service';
import { AuthservicesService } from '../../../src/app/services/authservices.service';

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
    private cargaService: CargaService,
    private _pagoService: PagoService,
    private authService: AuthservicesService
  ) {}

  ngOnInit(): void {
    this.llenarData();
    this.pedidoSelectSnapShot = _.cloneDeep(this.store.selectSnapshot(PedidoState.getPedido));
  }

  isAdmin(): boolean {
    return this.authService.getUserData()?.role === 'admin';
  }

  setearCliente(cliente: Cliente) {
    this.pedidoSelectSnapShot.cliente = cliente;
  }

  llenarData() {
    this.cargaService.show();

    if (this.isAdmin()) {
        this.apiService.getClientesActivos().subscribe({
            next: (resp: any) => {
                const list: Cliente[] = resp.data || resp;
                this.clientes = list;
                this.cargaService.hide();
            }, 
            error: () => this.cargaService.hide()
        });

    } else {
        this.apiService.getMiPerfil().subscribe({
            next: (miPerfil: Cliente) => {
                this.pedidoSelectSnapShot.cliente = miPerfil;
                this.cargaService.hide();
            },
            error: (err) => {
                console.error(err);
                this.cargaService.hide();
                Swal.fire({ title: 'Error', text: 'No se pudo cargar tu perfil de cliente', icon: 'error'});
            }
        });
    }
  }

  pagar() {
    this.cargaService.show();
    this.pedidoSelectSnapShot.fecha = this.fechaSelected;

    if (!this.pedidoSelectSnapShot.cliente) {
        this.cargaService.hide();
        Swal.fire({ title: "Error", text: "Falta asignar el cliente", icon: "warning" });
        return;
    }

    this._pedidoService.guardar(this.pedidoSelectSnapShot).subscribe({
      next: (response: any) => {
        this.cargaService.hide();
        
        const pedidoCreado = response.data || response;
        const nroPedido = pedidoCreado.nroPedido;

        this.store.dispatch(new SetPedidosAction(new Pedido()));

        Swal.fire({
          title: "Pedido guardado",
          icon: "success",
          timer: 1500,
          showConfirmButton: false
        }).then(() => {
            
            this._pagoService.pedidoPendienteId = nroPedido;

            this.router.navigate(['/pago']);
        });

      },
      error: () => {
        this.cargaService.hide();
        Swal.fire({ title: "Error", text: "No se pudo guardar", icon: "error" });
      }
    });
  }
}