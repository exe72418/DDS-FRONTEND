import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Pedido } from '../models/pedido';
import { ClienteService } from '../services/cliente.service';
import { Cliente } from '../models/cliente';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PagoService } from '../services/pago.service';
import { Pago } from '../models/pago';
import { PedidoServiceService } from '../services/pedido-service.service';
import Swal from 'sweetalert2';
import { LineaDeProducto } from '../models/lineaProducto';
import { CargaService } from '../services/carga.service';

@Component({
  selector: 'app-crear-pedido',
  templateUrl: './crear-pedido.component.html',
  styleUrl: './crear-pedido.component.css'
})
export class CrearPedidoComponent implements OnInit {

  @Input() pedido!: Pedido;
  @Output() editCrear: EventEmitter<boolean> = new EventEmitter();

  clientes: Cliente[] = [];
  clienteSelected!: Cliente;
  fechaSelected!: Date;
  pagoSelected!: boolean;
  entregaSelected!: boolean;
  pedidoForm!: FormGroup;
  pagos: Pago[] = [];
  lineasSelected: LineaDeProducto[] = [];


  minDateCalendar!: Date;
  fechaOriginalPedido!: Date | null;


  lineasOriginales: LineaDeProducto[] = [];

  constructor(
    private _clienteService: ClienteService,
    private cargaService: CargaService,
    private _pagoService: PagoService,
    private _pedidoService: PedidoServiceService
  ) {}

  ngOnInit(): void {
    this.pedidoForm = new FormGroup({
      nroPedido: new FormControl(''),
      cliente: new FormControl('', [Validators.required]),
      lineas: new FormControl([], [Validators.required]),
      fecha: new FormControl(''),
      total: new FormControl(''),
      entrega: new FormControl(''),
      pago: new FormControl('')
    });

    const hoy = new Date();
    const hoySoloFecha = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());

    if (this.pedido) {
      this.pedidoForm.patchValue(this.pedido);


      this.fechaOriginalPedido = this.pedido.fecha ? new Date(this.pedido.fecha) : null;
      this.fechaSelected = this.fechaOriginalPedido ? new Date(this.fechaOriginalPedido) : hoySoloFecha;

      const fechaOriginalSoloFecha = new Date(
        this.fechaSelected.getFullYear(),
        this.fechaSelected.getMonth(),
        this.fechaSelected.getDate()
      );

      this.minDateCalendar = fechaOriginalSoloFecha < hoySoloFecha ? fechaOriginalSoloFecha : hoySoloFecha;


      this.lineasOriginales = Array.isArray(this.pedido.lineas) ? [...this.pedido.lineas] : [];
      this.lineasSelected = [...this.lineasOriginales];


      this.pedidoForm.get('lineas')?.setValue(this.lineasSelected);

 
      this.recalcularTotalPorLineas(this.lineasSelected);
    } else {
      this.fechaOriginalPedido = null;
      this.fechaSelected = hoySoloFecha;
      this.minDateCalendar = hoySoloFecha;


      this.lineasOriginales = [];
      this.lineasSelected = [];
    }

    this._clienteService.getClientesActivos().subscribe((resp: any) => {
      const list = (resp.data || resp).filter((c: Cliente) => c.disponible === true);

      this.clientes = list.map((cliente: Cliente) => ({
        id: cliente.id,
        apellidoNombre: cliente.apellidoNombre,
        telefono: cliente.telefono,
        email: cliente.email,
        domicilio: cliente.domicilio,
        cuit: cliente.cuit,
        disponible: cliente.disponible,
        zona: cliente.zona
      }));
    });

    this._pagoService.getAll().subscribe((pagos) => {
      this.pagos = pagos;
    });

    this.pedidoForm.get('lineas')?.valueChanges.subscribe((val: LineaDeProducto[]) => {
      if (Array.isArray(val)) {
        this.lineasSelected = val;
        this.recalcularTotalPorLineas(this.lineasSelected);
      }
    });
  }

  private recalcularTotalPorLineas(lineas: LineaDeProducto[]) {
    const total = (lineas || []).reduce((acc: number, l: any) => {
      const sub = Number(l?.subtotal ?? 0);
      return acc + (isNaN(sub) ? 0 : sub);
    }, 0);

    this.pedidoForm.get('total')?.setValue(total, { emitEvent: false });
  }

  back() {
    this.editCrear.emit(false);
  }

  savePedido() {
    const hoy = new Date();
    const hoySoloFecha = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());

    const fechaElegida = new Date(this.fechaSelected);
    const fechaElegidaSoloFecha = new Date(
      fechaElegida.getFullYear(),
      fechaElegida.getMonth(),
      fechaElegida.getDate()
    );

    if (this.pedido && this.fechaOriginalPedido) {
      const original = new Date(this.fechaOriginalPedido);
      const originalSoloFecha = new Date(original.getFullYear(), original.getMonth(), original.getDate());

      const cambioFecha = fechaElegidaSoloFecha.getTime() !== originalSoloFecha.getTime();

      if (cambioFecha && fechaElegidaSoloFecha < hoySoloFecha) {
        Swal.fire({
          title: "Error",
          text: "Solo podés cambiar la fecha por una igual o posterior a hoy",
          icon: "warning"
        });
        return;
      }
    } else {
      if (fechaElegidaSoloFecha < hoySoloFecha) {
        Swal.fire({
          title: "Error",
          text: "La fecha no puede ser menor a la actual",
          icon: "warning"
        });
        return;
      }
    }


    this.pedidoForm.controls['fecha'].setValue(this.fechaSelected);

 
    const lineasFinales = Array.isArray(this.lineasSelected) ? this.lineasSelected : [];
    this.pedidoForm.get('lineas')?.setValue(lineasFinales, { emitEvent: false });
    this.recalcularTotalPorLineas(lineasFinales);


    const totalValue = this.pedidoForm.value.total;
    const totalInteger = Number(totalValue);
    if (!isNaN(totalInteger)) {
      this.pedidoForm.controls['total'].setValue(totalInteger, { emitEvent: false });
    }

    if (this.pedido != null) {
      this.cargaService.show();
      this._pedidoService.editar(this.pedidoForm.value).subscribe(() => {
        this.cargaService.hide();
        Swal.fire({
          title: "Pedido guardado",
          text: "",
          icon: "success"
        });
        this.editCrear.emit();
      }, () => {
        this.cargaService.hide();
        Swal.fire({
          title: "No se pudo guardar el pedido",
          text: "",
          icon: "error"
        });
      });
    } else {
      this.cargaService.show();
      this._pedidoService.guardar(this.pedidoForm.value).subscribe(() => {
        this.cargaService.hide();
        Swal.fire({
          title: "Pedido guardado",
          text: "",
          icon: "success"
        });
        this.editCrear.emit();
      }, () => {
        this.cargaService.hide();
        Swal.fire({
          title: "No se pudo guardar el pedido",
          text: "",
          icon: "error"
        });
      });
    }
  }
}
