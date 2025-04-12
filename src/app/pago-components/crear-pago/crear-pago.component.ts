import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Pago } from '../../models/pago';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PagoService } from '../../services/pago.service';
import { TipoPago } from '../../models/tipopago';
import { Pedido } from '../../models/pedido';
import { TipopagoService } from '../../services/tipopago.service';
import Swal from 'sweetalert2';
import { CargaService } from '../../services/carga.service';

@Component({
  selector: 'app-crear-pago',
  templateUrl: './crear-pago.component.html',
  styleUrls: ['./crear-pago.component.css']
})
export class CrearPagoComponent implements OnInit {
  @Input() pago!: Pago;
  @Output() editCrear: EventEmitter<boolean> = new EventEmitter();

  pagoForm!: FormGroup;
  tiposPago: TipoPago[] = [];
  pedidosSinPago: Pedido[] = [];

  constructor(private tipopagoService: TipopagoService, private cargaService: CargaService, private pagoService: PagoService) {
    this.pagoForm = new FormGroup({
      id: new FormControl(''),
      fecha: new FormControl('', [Validators.required]),
      tipoPago: new FormControl('', [Validators.required]),
      pedido: new FormControl('', [Validators.required])
    });
  }

  ngOnInit(): void {
    this.tipopagoService.getTiposDePagoActivos().subscribe((data: any) => {
      this.tiposPago = data['data'].map((tipoPago: TipoPago) => ({
        id: tipoPago.id,
        nombre: tipoPago.nombre,
        descripcion: tipoPago.descripcion,
        disponible: tipoPago.disponible
      }));
    });

    this.pagoService.getPedidosSinPago().subscribe((data: any) => {
      this.pedidosSinPago = data['data'].map((pedido: Pedido) => ({
        nroPedido: pedido.nroPedido,
        fecha: new Date(pedido.fecha),
        total: pedido.total,
        cliente: pedido.cliente,
        entrega: pedido.entrega,
        pago: pedido.pago,
        lineas: pedido.lineas
      }));
    });

    if (this.pago) {
      this.pago.fecha = new Date(this.pago.fecha);
      this.pagoForm.patchValue(this.pago);
    }
  }

  back() {
    this.editCrear.emit(false);
  }

  guardar(pag: Pago) {
    pag.fecha = new Date(pag.fecha);
    if (this.pago && this.pago.id) {
      this.cargaService.show();
      this.pagoService.update(pag).subscribe(() => {
        this.cargaService.hide();
        Swal.fire({
          title: "Guardado",
          text: "Pago actualizado",
          icon: "success"
        });
        this.editCrear.emit(false);
      }, error => {
        this.cargaService.hide();
        console.error('Error al modificar el pago:', error);
      });
    } else {
      pag.id = 0;
      this.pagoService.save(pag).subscribe(() => {
        this.cargaService.hide();
        Swal.fire({
          title: "Guardado",
          text: "Pago creado",
          icon: "success"
        });
        this.editCrear.emit(false);
      }, error => {
        this.cargaService.hide();
        console.error('Error al crear el pago:', error);
      });
    }
  }
}
