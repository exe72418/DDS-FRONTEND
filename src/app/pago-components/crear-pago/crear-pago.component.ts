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
  selectedPedido: Pedido | null = null; // Cambia a null al inicio

  constructor(private tipopagoService: TipopagoService, private _pagoService: PagoService) {
    this.pagoForm = new FormGroup({
      id: new FormControl(''),
      fecha: new FormControl('', [Validators.required]),
      tipoPago: new FormControl('', [Validators.required]),
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

    this._pagoService.getPedidosSinPago().subscribe((data: any) => {
      this.pedidosSinPago = data['data'];
    }, error => {
      console.error('Error al cargar pedidos sin pago:', error);
    });
  }

  onCheckboxChange(pedido: Pedido) {
    // Si ya hay un pedido seleccionado, lo deseleccionamos
    if (this.selectedPedido === pedido) {
      this.selectedPedido = null; // Deseleccionar si es el mismo
    } else {
      this.selectedPedido = pedido; // Seleccionar el nuevo pedido
    }
  }

  guardar(pag: Pago) {
    if (this.selectedPedido) {
      pag.pedido = this.selectedPedido; // Asigna el pedido seleccionado
    } else {
      console.error('No se ha seleccionado un pedido válido.');
      return; // Sal del método si no hay un pedido seleccionado
    }

    // Continúa con la lógica de guardado como antes
    if (this.pago != undefined || this.pago != null) {
      if (this.pago.id) {
        this._pagoService.update(pag).subscribe(pagBackend => {
          Swal.fire({
            title: "Guardado",
            text: "Pago actualizado",
            icon: "success"
          });
          this.editCrear.emit(false);
        }, error => {
          console.error('Error al modificar el pago:', error);
        });
      }
    } else {
      pag.id = 0;
      this._pagoService.save(pag).subscribe(pagBackend => {
        Swal.fire({
          title: "Guardado",
          text: "Pago creado",
          icon: "success"
        });
        this.editCrear.emit(false);
      }, error => {
        console.error('Error al crear el pago:', error);
      });
    }
  }

}
