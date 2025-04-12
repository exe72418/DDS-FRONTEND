import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TipopagoService } from '../../services/tipopago.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TipoPago } from '../../models/tipopago';
import Swal from 'sweetalert2';
import { CustomComponentsModule } from '../../modules/custom-components.module';
import { CargaService } from '../../services/carga.service';

@Component({
  selector: 'app-crear-tipopago',
  templateUrl: './crear-tipopago.component.html',
  styleUrls: ['./crear-tipopago.component.css']
})
export class CrearTipoPagoComponent implements OnInit {

  @Input() tipoPago!: TipoPago;
  @Output() editCrear: EventEmitter<boolean> = new EventEmitter();
  tipoPagoForm!: FormGroup;

  constructor(private tipopagoService: TipopagoService, private cargaService: CargaService) {
    this.tipoPagoForm = new FormGroup({
      id: new FormControl(''),
      nombre: new FormControl('', [Validators.required]),
      descripcion: new FormControl('', [Validators.required])
    });
  }

  back() {
    this.editCrear.emit(false)
  }

  ngOnInit(): void {
    if (this.tipoPago) {
      this.tipoPagoForm.patchValue(this.tipoPago);
    }
  }

  guardar(tipoPago: TipoPago) {
    if (this.tipoPagoForm.valid) {
      this.cargaService.show();
      if (!this.tipoPago) {
        tipoPago.id = 0;

        this.tipopagoService.create(tipoPago)
          .subscribe(response => {
            this.cargaService.hide();
            Swal.fire({
              title: "Guardado",
              text: 'Tipo de pago creado',
              icon: "success"
            });

            this.editCrear.emit(false);
          }, error => {
            this.cargaService.hide();
            console.error('Error al crear el tipo de pago:', error);
            Swal.fire({
              title: "Error",
              text: 'Error al crear el tipo de pago',
              icon: "error"
            });
          });

      } else {

        this.tipopagoService.update(tipoPago)
          .subscribe(response => {
            this.cargaService.hide();
            Swal.fire({
              title: "Guardado",
              text: 'Tipo de pago actualizado',
              icon: "success"
            });

            this.editCrear.emit(false);
          }, error => {
            this.cargaService.hide();
            console.error('Error al modificar el tipo de pago:', error);
            Swal.fire({
              title: "Error",
              text: 'Error al modificar el tipo de pago',
              icon: "error"
            });
          });
      }

    } else {
      this.cargaService.hide();
      Swal.fire({
        title: "Error",
        text: 'Formulario inválido. Verifique los datos ingresados.',
        icon: "error"
      });
      console.error('Formulario inválido');
    }
  }

}
