import { Component, OnInit } from '@angular/core';
import { Pedido } from '../models/pedido';
import { PedidoServiceService } from '../services/pedido-service.service';
import Swal from 'sweetalert2';
import { ClienteService } from '../services/cliente.service';
import { Cliente } from '../models/cliente';


@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrl: './pedidos.component.css'
})
export class PedidosComponent implements OnInit{

 

  crearMode: boolean = false;


  pedidos!:Pedido[];
  pedidoSelected!: Pedido;
  clienteSelect!: Cliente;
  fechaInicio!: Date;
  fechaFin!: Date;
  clientes!: Cliente[];

  constructor(private _pedidoService: PedidoServiceService, private _clienteService: ClienteService){

  }

  ngOnInit(): void {
    this.search();
    this._clienteService.getAll().subscribe(data => {
      this.clientes = data['data'].map((cliente: Cliente) => {
        const clienteFormateado: Cliente = {
          id: cliente.id,
          apellidoNombre: cliente.apellidoNombre,
          telefono: cliente.telefono,
          email: cliente.email,
          domicilio: cliente.domicilio,
          cuit: cliente.cuit,
          disponible: cliente.disponible,
          zona: cliente.zona
        };
        return clienteFormateado;
      });
    });
  }

  buscar() {
    const fechaInicio = this.fechaInicio ? new Date(this.fechaInicio) : null;
    const fechaFin = this.fechaFin ? new Date(this.fechaFin) : null;


    this._pedidoService.getPedidosByFilters(this.clienteSelect, fechaInicio,fechaFin).subscribe((pedidos)=>{
      this.pedidos = pedidos;
    })
  }

  search(){
    this._pedidoService.getAll().subscribe((pedidos)=>{
      this.pedidos = pedidos

    })
  }

  new() {
    this.crearMode = true;
  }

  changeEditCreate() {
    this.crearMode = false;
  }

  deleteProduct(ped: Pedido) {
    Swal.fire({
      title: "Atencion?",
      text: "Deseas borrar el pedido " + ped.nroPedido,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si"
    }).then((result) => {
      if (result.isConfirmed) {
        this._pedidoService.delete(ped).subscribe((ped)=>{
          Swal.fire({
            title: "Pedido borrado",
            text: "",
            icon: "success"
          });
          this.search();
        },(error)=>{
          Swal.fire({
            title: "Pedido no se borro",
            text: error.message,
            icon: "error"
          });
        })
      }
    });
  }
  editProduct(ped: Pedido) {
    this.pedidoSelected = ped;
    this.crearMode = true;
  }
}
