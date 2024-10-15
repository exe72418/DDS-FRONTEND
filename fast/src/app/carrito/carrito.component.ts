import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { PedidoState } from '../states/pedido.state';
import { Observable } from 'rxjs';
import { Pedido } from '../models/pedido';
import Swal from 'sweetalert2';
import { Cliente } from '../models/cliente';
import { ClienteService } from '../services/cliente.service';
import _ from 'lodash';
import { PedidoServiceService } from '../services/pedido-service.service';


@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrl: './carrito.component.css'
})
export class  CarritoComponent implements OnInit {


  @Select(PedidoState.getPedido) pedido$!: Observable<Pedido>;
  pedidoSelectSnapShot!: Pedido;
  clientes: Cliente[]|undefined;
  clienteSelected!: Cliente;


constructor(private store:Store, private apiService:ClienteService , private _pedidoService: PedidoServiceService){

}

  ngOnInit(): void {
    this.llenarData();
    
    /* this.pedido$.subscribe(
      pedido => {
        this.pedidoSelectSnapShot = pedido
        console.log('Pedido en CarritoComponent:', pedido);
      },
      error => {
        console.error('Error al suscribirse a pedido$', error);
      }
    );  */
    this.pedidoSelectSnapShot = _.cloneDeep(this.store.selectSnapshot(PedidoState.getPedido))
    console.log(this.pedidoSelectSnapShot)
  }

  setearCliente(cliente: Cliente) {
    this.pedidoSelectSnapShot.cliente = cliente;
    console.log(this.pedidoSelectSnapShot)

  }

  llenarData() {
    this.apiService.getAllClients().subscribe(data => {
      this.clientes = data['data'].map((cliente: Cliente) => {
        const clienteFormateado: Cliente = {
          id: cliente.id,
          apellidoNombre: cliente.apellidoNombre,
          telefono: cliente.telefono,
          email: cliente.email,
          domicilio: cliente.domicilio,
          cuit: cliente.cuit,
          disponible:cliente.disponible,
          zona:cliente.zona
        };
        return clienteFormateado;
      });
      console.log(data['data'][0]);
    });
  }

  pagar(){
                                                                                                                      this._pedidoService.guardar(this.pedidoSelectSnapShot).subscribe(response => {
      console.log(response)
      Swal.fire({
        title: "Listo!",
        text: "Pago realizado",
        icon: "success"
      });

    }, error => {

      console.error('Error al crear el pedido', error);
      Swal.fire({
        title: "Error",
        text: 'Error al crear el pedido',
        icon: "error"
      });
    });
    
  }
}
