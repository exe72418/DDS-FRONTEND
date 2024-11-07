import { Component, OnInit } from '@angular/core';
import { Pedido } from '../models/pedido';
import { PedidoServiceService } from '../services/pedido-service.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrl: './pedidos.component.css'
})
export class PedidosComponent implements OnInit{

  crearMode: boolean = false;


  pedidos!:Pedido[];
  pedidoSelected!: Pedido;

  constructor(private _pedidoService: PedidoServiceService){

  }

  ngOnInit(): void {
    this.search()
  }

  search(){
    this._pedidoService.getAll().subscribe((pedidos)=>{
      console.log(pedidos)
      this.pedidos = pedidos

    })
  }

  new() {
    this.crearMode = true;
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
