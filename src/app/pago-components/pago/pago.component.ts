import { Component, OnInit, OnDestroy } from '@angular/core'; 
import { PagoService } from '../../services/pago.service';
import { Pago } from '../../models/pago';
import Swal from 'sweetalert2';
import { CargaService } from '../../services/carga.service';
import { AuthservicesService } from '../../services/authservices.service'; 
import { MatDialog } from '@angular/material/dialog';
import { LineaProductoService } from '../../services/lineaproducto-service.service';
import { DetallePedidoComponent } from '../../detalle-pedido/detalle-pedido.component';
import { Pedido } from '../../models/pedido';
import { BreakpointService } from '../../services/breakpoint.service'; 
import { Subscription } from 'rxjs'; 

@Component({
  selector: 'app-pago',
  templateUrl: './pago.component.html',
  styleUrl: './pago.component.css'
})
export class PagoComponent implements OnInit, OnDestroy {

  pagoSelected: Pago | null = null;
  crearEditarModePago: boolean = false;
  pagos: Pago[] = [];
  pedidoHijo: number | null = null;

  isMobile: boolean = false;
  private resizeSub!: Subscription;

  constructor(
    private _pagoService: PagoService, 
    private cargaService: CargaService,
    private authService: AuthservicesService,
    private dialog: MatDialog,
    private _lineaProductoService: LineaProductoService,
    private breakpointService: BreakpointService 
  ) {}

  ngOnInit(): void {
    this.cargaService.show();
    
    this.resizeSub = this.breakpointService.isMobile$.subscribe({
      next: (mobile) => {
        this.isMobile = mobile;
      }
    });

    this.search();

    if (this._pagoService.pedidoPendienteId) {
        this.pedidoHijo = this._pagoService.pedidoPendienteId;
        this.crearEditarModePago = true; 
        this._pagoService.pedidoPendienteId = null;
    }
  }

  ngOnDestroy(): void {
    if (this.resizeSub) {
      this.resizeSub.unsubscribe();
    }
  }

  isAdmin(): boolean {
    return this.authService.getUserData()?.role === 'admin';
  }

  search() {
    this.cargaService.show(); 

    let observablePagos;

    if (this.isAdmin()) {
        observablePagos = this._pagoService.getAll();
    } else {
        observablePagos = this._pagoService.misPagos(); 
    }

    observablePagos.subscribe({
      next: (response: any) => {
        this.pagos = response.data || response.pagos || response;
      },
      error: (error: any) => {
        console.error('Error al cargar pagos:', error);
        this.cargaService.hide(); 
        Swal.fire({
            title: "Error",
            text: "No se pudieron cargar los pagos.",
            icon: "error"
        });
      },
      complete: () => {
        this.cargaService.hide(); 
      }
    });
  }

  showDetallePedido(pedido: Pedido | undefined) {
    if (!pedido || !pedido.nroPedido) {
        Swal.fire({ title: 'Error', text: 'Información del pedido no disponible', icon: 'warning' });
        return;
    }

    this.cargaService.show();
    
    this._lineaProductoService.getLineasByPedidoId(pedido.nroPedido).subscribe({
      next: (lineas) => {
        this.cargaService.hide();

        if (lineas.length === 0) {
          Swal.fire({
            title: 'Sin líneas',
            text: 'El pedido asociado no tiene productos cargados.',
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
        Swal.fire({ title: 'Error', text: 'No se pudieron cargar los detalles del pedido', icon: 'error' });
      }
    });
  }

  cambiarEditarCrear() {
    this.crearEditarModePago = false;
    this.pagoSelected = null;
    this.search();
  }

  deletePago(pag: Pago) {
    Swal.fire({
      title: "Atencion?",
      text: "Deseas borrar el pago " + pag.id,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, borrar!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.cargaService.show();
        
        this._pagoService.delete(pag.id).subscribe({
            next: () => {
                this.cargaService.hide();
                Swal.fire({
                    title: "Pago borrado",
                    text: "",
                    icon: "success"
                });
                this.search();
            }, 
            error: () => {
                this.cargaService.hide(); 
                Swal.fire({
                    title: "Error",
                    text: "Error al borrar el pago",
                    icon: "error"
                });
            }
        });
      }
    });
  }

  editPago(pag: Pago) {
    this.pagoSelected = pag;
    this.crearEditarModePago = true;
  }

  new() {
    this.pagoSelected = null;
    this.crearEditarModePago = true;
  }
}