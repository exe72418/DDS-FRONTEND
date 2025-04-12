import { Component, OnInit } from '@angular/core';
import { Pedido } from '../models/pedido';
import { PedidoServiceService } from '../services/pedido-service.service';
import Swal from 'sweetalert2';
import { ClienteService } from '../services/cliente.service';
import { Cliente } from '../models/cliente';
import { LineaProductoService } from '../services/lineaproducto-service.service';
import { CargaService } from '../services/carga.service';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.css']
})
export class PedidosComponent implements OnInit {

  crearMode: boolean = false;
  pedidos!: Pedido[];
  pedidoSelected!: Pedido;
  clienteSelect!: Cliente;
  fechaInicio!: Date;
  fechaFin!: Date;
  clientes!: Cliente[];

  constructor(
    private _pedidoService: PedidoServiceService,
    private _clienteService: ClienteService,
    private _lineaProductoService: LineaProductoService,
    private cargaService: CargaService
  ) { }

  ngOnInit(): void {
    this.search();
    this._clienteService.getAll().subscribe(data => {
      this.clientes = data['data'];
    });
  }

  search() {
    this.cargaService.show();
    this._pedidoService.getAll().subscribe((pedidos) => {
      this.pedidos = pedidos;
    });
    this.cargaService.hide();
  }

  buscar() {
    const fechaInicio = this.fechaInicio ? new Date(this.fechaInicio) : null;
    const fechaFin = this.fechaFin ? new Date(this.fechaFin) : null;

    this._pedidoService.getPedidosByFilters(this.clienteSelect, fechaInicio, fechaFin).subscribe((pedidos) => {
      this.pedidos = pedidos;
    });
  }

  new() {
    this.crearMode = true;
  }

  changeEditCreate() {
    this.crearMode = false;
    this.search();
  }

  deleteProduct(ped: Pedido) {
    Swal.fire({
      title: "Atención",
      text: `¿Deseas borrar el pedido ${ped.nroPedido}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí"
    }).then((result) => {
      if (result.isConfirmed) {
        this.cargaService.show();
        this._pedidoService.delete(ped).subscribe(() => {
          this.cargaService.hide();
          Swal.fire({
            title: "Pedido borrado",
            icon: "success"
          });
          this.search();
        }, (error) => {
          this.cargaService.hide();
          Swal.fire({
            title: "Error",
            text: error.message,
            icon: "error"
          });
        });
      }
    });
  }

  editProduct(ped: Pedido) {
    this.pedidoSelected = ped;
    this.crearMode = true;
  }

  showProductDetails(pedido: Pedido) {
    this.cargaService.show();
    if (!pedido.nroPedido) {
      this.cargaService.hide();
      Swal.fire({
        title: 'Error',
        text: 'No se pudo encontrar el pedido.',
        icon: 'error'
      });
      return;
    }

    this._lineaProductoService.getLineasByPedidoId(pedido.nroPedido).subscribe((lineas) => {
      if (lineas.length === 0) {
        this.cargaService.hide();
        Swal.fire({
          title: 'Sin líneas de producto',
          text: 'Este pedido no tiene líneas de producto.',
          icon: 'info'
        });
        return;
      }
      this.cargaService.hide();
      this.generateProductTable(lineas);
    });
  }

  generateProductTable(lineas: any[]) {
    let htmlContent = `
      <table class="table table-bordered" style="width: 100%; text-align: left;">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Precio</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
    `;

    lineas.forEach(linea => {
      htmlContent += `
        <tr>
          <td>${linea.producto.descripcion}</td>
          <td>${linea.cantidad}</td>
          <td>${new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(linea.producto.precio)}</td>
          <td>${new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(linea.subtotal)}</td>
        </tr>
      `;
    });


    Swal.fire({
      title: 'Detalle de líneas de productos',
      html: htmlContent,
      icon: 'info',
      showCloseButton: true,
      confirmButtonText: 'Cerrar'
    });
  }
}
