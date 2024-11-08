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

@Injectable({
  providedIn: 'root'
})
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
  fechaSelected!: Date; 


constructor(private store:Store, private apiService:ClienteService , private _pedidoService: PedidoServiceService){

}

  ngOnInit(): void {
    this.llenarData();

    this.pedidoSelectSnapShot = _.cloneDeep(this.store.selectSnapshot(PedidoState.getPedido))
  }

  setearCliente(cliente: Cliente) {
    this.pedidoSelectSnapShot.cliente = cliente;

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
    });
  }

  pagar(){
    this.pedidoSelectSnapShot.fecha = this.fechaSelected;


    this._pedidoService.guardar(this.pedidoSelectSnapShot).subscribe((ped)=>{
      Swal.fire({
        title: "Pedido guardado",
        text: "",
        icon: "success"
      });
    }, 
    (err: any) => {
      Swal.fire({
        title: "No se pudo guardar el pedido",
        text: "",
        icon: "error"
      });
      });
  }
}
