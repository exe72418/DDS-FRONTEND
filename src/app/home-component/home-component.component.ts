import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { PedidoState, SetPedidosAction } from '../states/pedido.state';
import _ from 'lodash';
import { ProductosServiceService } from '../services/productos-service.service';
import { Producto } from '../models/producto';
import { Pedido } from '../models/pedido';
import { LineaDeProducto } from '../models/lineaProducto';


@Component({
  selector: 'app-home-component',
  templateUrl: './home-component.component.html',
  styleUrl: './home-component.component.css'
})
export class HomeComponentComponent implements OnInit, OnDestroy {


  constructor(private _productoService: ProductosServiceService, private store: Store,
  ) {
  }


  @Input() productos!: Producto[];
  pedido!: Pedido;


  ngOnInit(): void {

    this._productoService.getAll().subscribe((productos) => {
      this.productos = productos;
    })
    this.pedido = new Pedido()
    this.pedido.lineas = []
    this.pedido.total = 0;
  }

  agregar(producto: Producto) {
    let lineaProd = new LineaDeProducto();

    lineaProd.cantidad = 1;
    lineaProd.producto = producto;
    lineaProd.subtotal = producto.precio;

    let encontro = false;

    if (this.pedido.lineas.length > 0) {
      this.pedido.lineas.map((linea) => {
        if (linea.producto.codigo == producto.codigo) {
          encontro = true;
          linea.cantidad++;
          linea.subtotal = linea.subtotal + producto.precio;
          this.pedido.total = this.pedido.total + linea.producto.precio;
        }
      })
      if (!encontro) {
        this.pedido.lineas = [...this.pedido.lineas, lineaProd];
        this.pedido.total = this.pedido.total + lineaProd.producto.precio;

      }
    } else {
      this.pedido.lineas = [...this.pedido.lineas, lineaProd];
      this.pedido.total = this.pedido.total + lineaProd.producto.precio;


    }


    let pedidoState = this.pedido;
    this.store.dispatch(new SetPedidosAction(_.cloneDeep(this.pedido)))

  }

  consolelog() {
    this.store.dispatch(new SetPedidosAction(_.cloneDeep(this.pedido)))

    let pedido: Pedido = this.store.selectSnapshot(PedidoState.getPedido)

  }

  ngOnDestroy(): void {
    this.store.dispatch(new SetPedidosAction(_.cloneDeep(this.pedido)))

  }
}
