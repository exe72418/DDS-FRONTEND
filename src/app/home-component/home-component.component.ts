import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { PedidoState, SetPedidosAction } from '../states/pedido.state';
import _ from 'lodash';
import { ProductosServiceService } from '../services/productos-service.service';
import { Producto } from '../models/producto';
import { Pedido } from '../models/pedido';
import { LineaDeProducto } from '../models/lineaProducto';
import { CargaService } from '../services/carga.service';

@Component({
  selector: 'app-home-component',
  templateUrl: './home-component.component.html',
  styleUrl: './home-component.component.css'
})
export class HomeComponentComponent implements OnInit, OnDestroy {

  constructor(private _productoService: ProductosServiceService, private cargaService: CargaService, private store: Store) { }

  @Input() productos!: Producto[];
  pedido!: Pedido;

  ngOnInit(): void {
    this._productoService.getProductosActivos().subscribe((productos) => {
      this.productos = productos;
    });
    this.pedido = new Pedido();
    this.pedido.lineas = [];
    this.pedido.total = 0;
  }

  agregar(producto: Producto) {
    this.cargaService.show();
    let lineaProd = new LineaDeProducto();
    lineaProd.cantidad = 1;
    lineaProd.producto = producto;
    lineaProd.subtotal = producto.precio;

    let encontro = false;

    if (this.pedido.lineas.length > 0) {
      this.pedido.lineas.map((linea) => {
        this.cargaService.hide();
        if (linea.producto.codigo == producto.codigo) {
          encontro = true;
          linea.cantidad++;
          linea.subtotal += producto.precio;
          this.pedido.total += linea.producto.precio;
        }
      });
      if (!encontro) {
        this.cargaService.hide();
        this.pedido.lineas = [...this.pedido.lineas, lineaProd];
        this.pedido.total += lineaProd.producto.precio;
      }
    } else {
      this.cargaService.hide();
      this.pedido.lineas = [...this.pedido.lineas, lineaProd];
      this.pedido.total += lineaProd.producto.precio;
    }

    this.store.dispatch(new SetPedidosAction(_.cloneDeep(this.pedido)));
  }

  restar(producto: Producto) {
    this.cargaService.show();
    let index = this.pedido.lineas.findIndex(linea => linea.producto.codigo === producto.codigo);

    if (index !== -1) {
      this.cargaService.hide();
      let linea = this.pedido.lineas[index];

      if (linea.cantidad > 1) {
        linea.cantidad--;
        linea.subtotal -= producto.precio;
        this.pedido.total -= producto.precio;
      } else {
        this.eliminar(producto);
      }

      this.store.dispatch(new SetPedidosAction(_.cloneDeep(this.pedido)));
    }
  }

  eliminar(producto: Producto) {
    this.cargaService.show();
    this.pedido.lineas = this.pedido.lineas.filter(linea => linea.producto.codigo !== producto.codigo);
    this.pedido.total = this.pedido.lineas.reduce((total, linea) => total + linea.subtotal, 0);

    this.store.dispatch(new SetPedidosAction(_.cloneDeep(this.pedido)));
    this.cargaService.hide();
  }

  consolelog() {
    this.store.dispatch(new SetPedidosAction(_.cloneDeep(this.pedido)));
    let pedido: Pedido = this.store.selectSnapshot(PedidoState.getPedido);
  }

  ngOnDestroy(): void {
    this.store.dispatch(new SetPedidosAction(_.cloneDeep(this.pedido)));
  }
}
