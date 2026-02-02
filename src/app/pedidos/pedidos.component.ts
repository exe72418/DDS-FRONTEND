import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog'; 
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { Pedido } from '../models/pedido';
import { Cliente } from '../models/cliente';
import { PedidoServiceService } from '../services/pedido-service.service';
import { ClienteService } from '../services/cliente.service';
import { LineaProductoService } from '../services/lineaproducto-service.service';
import { CargaService } from '../services/carga.service';
import { PagoService } from '../services/pago.service';
import { DetallePedidoComponent } from '../detalle-pedido/detalle-pedido.component';

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
  clientes: Cliente[] = [];

  constructor(
    private _pedidoService: PedidoServiceService,
    private _clienteService: ClienteService,
    private _lineaProductoService: LineaProductoService,
    private cargaService: CargaService,
    private _pagoService: PagoService, 
    private router: Router,
    private dialog: MatDialog 
  ) { }

  ngOnInit(): void {
    this.search();
    this.cargarClientes();
  }



  cargarClientes() {
    this._clienteService.getClientesActivos().subscribe((resp: any) => {
      const list: Cliente[] = resp.data || resp;
      this.clientes = list;
    });
  }

  search() {
    this.cargaService.show();
    this._pedidoService.getAll().subscribe({
      next: (pedidos) => {
        this.pedidos = pedidos;
        this.cargaService.hide();
      },
      error: () => {
        this.cargaService.hide();
      }
    });
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

  editProduct(ped: Pedido) {
    this.pedidoSelected = ped;
    this.crearMode = true;
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
        this._pedidoService.delete(ped).subscribe({
          next: () => {
            this.cargaService.hide();
            Swal.fire({ title: "Pedido borrado", icon: "success" });
            this.search();
          },
          error: (error) => {
            this.cargaService.hide();
            Swal.fire({ title: "Error", text: error.message, icon: "error" });
          }
        });
      }
    });
  }

  showProductDetails(pedido: Pedido) {
    this.cargaService.show();
    
    if (!pedido.nroPedido) {
      this.cargaService.hide();
      return;
    }

    this._lineaProductoService.getLineasByPedidoId(pedido.nroPedido).subscribe({
      next: (lineas) => {
        this.cargaService.hide();

        if (lineas.length === 0) {
          Swal.fire({
            title: 'Sin líneas',
            text: 'Este pedido no tiene productos cargados.',
            icon: 'info'
          });
          return;
        }

        this.dialog.open(DetallePedidoComponent, {
          data: { 
            lineas: lineas,
            nroPedido: pedido.nroPedido
          }
        });
      },
      error: (error) => {
        this.cargaService.hide();
        console.error(error);
        Swal.fire({ title: 'Error', text: 'No se pudieron cargar los detalles', icon: 'error' });
      }
    });
  }


  irAPago(pedido: Pedido) {
      if (pedido.nroPedido) {
          this._pagoService.pedidoPendienteId = pedido.nroPedido;
          this.router.navigate(['/pago']);
      }
  }
}