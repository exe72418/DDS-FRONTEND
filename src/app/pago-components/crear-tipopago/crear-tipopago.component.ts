import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TipopagoService } from '../../services/tipopago.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TipoPago } from '../../models/tipopago';
import Swal from 'sweetalert2';
import { CargaService } from '../../services/carga.service';

@Component({
  selector: 'app-crear-tipopago',
  templateUrl: './crear-tipopago.component.html',
  styleUrls: ['./crear-tipopago.component.css']
})
export class CrearTipoPagoComponent implements OnInit {

  @Input() tipoPago: TipoPago | null = null;
  @Output() editCrear: EventEmitter<boolean> = new EventEmitter();

  tipoPagoForm: FormGroup;

  constructor(private tipopagoService: TipopagoService, private cargaService: CargaService) {
    this.tipoPagoForm = new FormGroup({
      id: new FormControl(''),
      nombre: new FormControl('', [Validators.required]),
      descripcion: new FormControl('', [Validators.required])
    });
  }

  back() {
    this.editCrear.emit(false);
  }

  ngOnInit(): void {
    if (this.tipoPago?.id) {
      this.tipoPagoForm.patchValue(this.tipoPago);
    } else {
      this.tipoPagoForm.reset();
    }
  }

  guardar(tipoPago: TipoPago) {
    if (!this.tipoPagoForm.valid) {
      Swal.fire({
        title: "Error",
        text: 'Formulario inválido. Verifique los datos ingresados.',
        icon: "error"
      });
      return;
    }

    const esEdicion = !!this.tipoPago && !!this.tipoPago.id;

    this.cargaService.show();

    if (!esEdicion) {
      tipoPago.id = 0;
      this.tipopagoService.create(tipoPago).subscribe(() => {
        this.cargaService.hide();
        Swal.fire({
          title: "Guardado",
          text: 'Tipo de pago creado',
          icon: "success"
        });
        this.editCrear.emit(false);
      }, (error) => {
        this.cargaService.hide();
        console.error('Error al crear el tipo de pago:', error);
        Swal.fire({
          title: "Error",
          text: 'Error al crear el tipo de pago',
          icon: "error"
        });
      });
    } else {
      this.tipopagoService.update(tipoPago).subscribe(() => {
        this.cargaService.hide();
        Swal.fire({
          title: "Guardado",
          text: 'Tipo de pago actualizado',
          icon: "success"
        });
        this.editCrear.emit(false);
      }, (error) => {
        this.cargaService.hide();
        console.error('Error al modificar el tipo de pago:', error);
        Swal.fire({
          title: "Error",
          text: 'Error al modificar el tipo de pago',
          icon: "error"
        });
      });
    }
  }
}
