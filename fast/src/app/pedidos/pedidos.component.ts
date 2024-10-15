import { Component, OnInit } from '@angular/core';
import { PedidoServiceService } from '../services/pedido-service.service';
import { Pedido } from '../models/pedido';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrl: './pedidos.component.css'
})
export class PedidosComponent implements OnInit{
deleteProduct(arg0: any) {
throw new Error('Method not implemented.');
}
editProduct(arg0: any) {
throw new Error('Method not implemented.');
}

  pedidos!:Pedido[];

  constructor(private _pedidoService: PedidoServiceService){

  }

  ngOnInit(): void {
    this._pedidoService.getAll().subscribe((pedidos)=>{
      console.log(pedidos)
      this.pedidos = pedidos
      
    })
  
  }
}
