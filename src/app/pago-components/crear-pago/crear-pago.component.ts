import { Component, EventEmitter, Input, OnInit, Output, OnDestroy } from '@angular/core'; 
import { Pago } from '../../models/pago';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PagoService } from '../../services/pago.service';
import { TipoPago } from '../../models/tipopago';
import { Pedido } from '../../models/pedido';
import { TipopagoService } from '../../services/tipopago.service';
import Swal from 'sweetalert2';
import { CargaService } from '../../services/carga.service';
import { forkJoin, Subscription } from 'rxjs';
import { LineaProductoService } from '../../services/lineaproducto-service.service';
import { AuthservicesService } from '../../services/authservices.service';
import { BreakpointService } from '../../services/breakpoint.service'; 

@Component({
  selector: 'app-crear-pago',
  templateUrl: './crear-pago.component.html',
  styleUrls: ['./crear-pago.component.css']
})
export class CrearPagoComponent implements OnInit, OnDestroy {
  @Input() pago: Pago | null = null;
  @Output() editCrear: EventEmitter<boolean> = new EventEmitter();
  @Input() nroPedidoPreseleccionado: number | null = null;

  pagoForm: FormGroup;
  tiposPago: TipoPago[] = [];
  pedidosDisponibles: Pedido[] = [];

  isMobile: boolean = false;
  private resizeSub!: Subscription;

  constructor(
    private tipopagoService: TipopagoService,
    private cargaService: CargaService,
    private pagoService: PagoService,
    private lineaProductoService: LineaProductoService,
    private authService: AuthservicesService,
    private breakpointService: BreakpointService 
  ) {
    this.pagoForm = new FormGroup({
      id: new FormControl(''),
      fecha: new FormControl('', [Validators.required]),
      tipoPago: new FormControl('', [Validators.required]),
      pedido: new FormControl('', [Validators.required])
    });
  }

  ngOnInit(): void {
    this.cargaService.show();

    this.resizeSub = this.breakpointService.isMobile$.subscribe({
      next: (mobile) => {
        this.isMobile = mobile;
      }
    });

    let observablePedidos;
    if (this.isAdmin()) {
        observablePedidos = this.pagoService.getPedidosSinPago(); 
    } else {
        observablePedidos = this.pagoService.getMisPedidosSinPago(); 
    }

    forkJoin({
        tipos: this.tipopagoService.getTiposDePagoActivos(),
        pedidos: observablePedidos
    }).subscribe({
        next: (res: any) => {
            this.tiposPago = res.tipos.data || res.tipos;

            const listaPedidosLibres = res.pedidos.data || res.pedidos;
            const mapaPedidos = new Map<number, Pedido>();

            listaPedidosLibres.forEach((p: Pedido) => {
                if(p.nroPedido) mapaPedidos.set(p.nroPedido!, p);
            });

            if (this.pago && this.pago.pedido) {
                if(this.pago.pedido.nroPedido) {
                    mapaPedidos.set(this.pago.pedido.nroPedido!, this.pago.pedido);
                }
            }

            this.pedidosDisponibles = Array.from(mapaPedidos.values());

            if (this.pago && this.pago.id) {
                this.configurarEdicion();
            } else {
                this.pagoForm.reset();
                this.pagoForm.get('fecha')?.setValue(new Date());

                if (this.nroPedidoPreseleccionado) {
                    const pedidoEncontrado = this.pedidosDisponibles.find(p => p.nroPedido == this.nroPedidoPreseleccionado);
                    if (pedidoEncontrado) {
                        this.pagoForm.patchValue({ pedido: pedidoEncontrado });
                    }
                }
                
                this.cargaService.hide();
            }
        },
        error: (err) => {
            console.error(err);
            this.cargaService.hide();
        }
    });
  }

  ngOnDestroy(): void {
    if (this.resizeSub) {
      this.resizeSub.unsubscribe();
    }
  }

  isAdmin(): boolean {
    return this.authService.getUserData()?.role === 'admin';
  }

  get pedidoSeleccionado(): Pedido | null {
    return this.pagoForm.get('pedido')?.value;
  }

  configurarEdicion() {
    const fechaPago = new Date(this.pago!.fecha as any);
    const tipoSeleccionado = this.tiposPago.find(t => t.id === this.pago!.tipoPago.id!);
    const pedidoSeleccionado = this.pedidosDisponibles.find(p => p.nroPedido === this.pago!.pedido!.nroPedido!);

    if (pedidoSeleccionado && (!pedidoSeleccionado.lineas || pedidoSeleccionado.lineas.length === 0)) {
        this.lineaProductoService.getLineasByPedidoId(pedidoSeleccionado.nroPedido!).subscribe({
            next: (lineas) => {
                pedidoSeleccionado.lineas = lineas;
                this.pagoForm.patchValue({
                    id: this.pago!.id,
                    fecha: fechaPago,
                    tipoPago: tipoSeleccionado,
                    pedido: pedidoSeleccionado 
                });
                this.cargaService.hide();
            },
            error: (err) => {
                console.error("Error cargando lineas del pedido", err);
                this.cargaService.hide();
            }
        });
    } else {
        this.pagoForm.patchValue({
            id: this.pago!.id,
            fecha: fechaPago,
            tipoPago: tipoSeleccionado,
            pedido: pedidoSeleccionado
        });
        this.cargaService.hide();
    }
  }

  atras() {
    this.editCrear.emit(false);
  }

  guardar(pag: Pago) {
    if (this.pagoForm.invalid) {
        Swal.fire({ title: "Error", text: "Formulario inválido", icon: "warning" });
        return;
    }

    if (pag.fecha) {
        pag.fecha = new Date(pag.fecha);
    }

    const esEdicion = !!this.pago && !!this.pago.id;
    this.cargaService.show();

    if (esEdicion) {
      this.pagoService.update(pag).subscribe({
        next: () => {
            this.cargaService.hide();
            Swal.fire({ title: "Guardado", text: "Pago actualizado", icon: "success" });
            this.editCrear.emit(false);
        },
        error: (error) => {
            this.cargaService.hide();
            Swal.fire({ title: "Error", text: error.error.message || "Error al modificar", icon: "error" });
        }
      });
    } else {
      pag.id = 0; 
      this.pagoService.save(pag).subscribe({
        next: () => {
            this.cargaService.hide();
            Swal.fire({ title: "Guardado", text: "Pago creado", icon: "success" });
            this.editCrear.emit(false);
        },
        error: (error) => {
            this.cargaService.hide();
            Swal.fire({ title: "Error", text: error.error.message || "Error al crear", icon: "error" });
        }
      });
    }
  }
}