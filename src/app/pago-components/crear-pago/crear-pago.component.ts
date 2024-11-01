import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Pago } from '../../models/pago';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PagoService } from '../../services/pago.service';
import { TipoPago } from '../../models/tipopago';
import { Pedido } from '../../models/pedido';
import { TipopagoService } from '../../services/tipopago.service';
import Swal from 'sweetalert2';

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
  selectedPedido: Pedido | null = null;

  constructor(private tipopagoService: TipopagoService, private pagoService: PagoService) {
    this.pagoForm = new FormGroup({
      id: new FormControl(''),
      fecha: new FormControl('', [Validators.required]),
      tipoPago: new FormControl('', [Validators.required]),
      pedido: new FormControl('', [Validators.required])
    });
  }

  ngOnInit(): void {
    if (this.pago != null) {
      this.pagoForm.patchValue(this.pago);
    }

    this.tipopagoService.getAll().subscribe((data: any) => {
      this.tiposPago = data['data'].map((tipoPago: TipoPago) => ({
        id: tipoPago.id,
        nombre: tipoPago.nombre,
        descripcion: tipoPago.descripcion,
      }));
    });

    this.pagoService.getPedidosSinPago().subscribe((data: any) => {
      this.pedidosSinPago = data;
    });
  }

  guardar() {
    const tipoPagoSeleccionado = this.pagoForm.get('tipoPago')?.value;
    const pedidoSeleccionado = this.selectedPedido;

    if (!tipoPagoSeleccionado) {
      Swal.fire('Error', 'Debe seleccionar un tipo de pago.', 'error');
      return;
    }

    if (!pedidoSeleccionado) {
      Swal.fire('Error', 'Debe seleccionar un pedido.', 'error');
      return;
    }

    // Solo asigna el pedido seleccionado al nuevo pago
    const nuevoPago: Partial<Pago> = {
      ...this.pagoForm.value,
      tipoPago: tipoPagoSeleccionado,
      pedido: { nro_pedido: pedidoSeleccionado.nroPedido } // Asigna el pedido existente
    };

    // Guarda el pago
    if (!this.pago || !this.pago.id) {
      delete nuevoPago.id; // Elimina el id si es un nuevo pago
      this.pagoService.save(nuevoPago as Pago).subscribe(
        response => {
          this.editCrear.emit(false);
          Swal.fire('Guardado', 'Pago creado y asociado al pedido', 'success');
        },
        error => {
          console.error(error);
          Swal.fire('Error', 'No se pudo crear el pago', 'error');
        }
      );
    } else {
      nuevoPago.id = this.pago.id;
      this.pagoService.update(nuevoPago as Pago).subscribe(
        response => {
          this.editCrear.emit(false);
          Swal.fire('Guardado', 'Pago actualizado y asociado al pedido', 'success');
        },
        error => {
          console.error(error);
          Swal.fire('Error', 'No se pudo actualizar el pago', 'error');
        }
      );
    }
  }
}
