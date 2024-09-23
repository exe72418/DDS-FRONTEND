import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TipopagoService } from '../../services/tipopago.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TipoPago } from '../../models/tipopago';
import Swal from 'sweetalert2';
import { CustomComponentsModule } from '../../modules/custom-components.module';

@Component({
  selector: 'app-crear-tipopago',
  standalone: true,
  imports: [CustomComponentsModule],
  templateUrl: './crear-tipopago.component.html',
  styleUrls: ['./crear-tipopago.component.css']
})
export class CrearTipoPagoComponent implements OnInit {

  @Input() tipoPago!: TipoPago;
  @Output() editCrear: EventEmitter<boolean> = new EventEmitter();
  tipoPagoForm!: FormGroup;

  constructor(private tipopagoService: TipopagoService) {
    this.tipoPagoForm = new FormGroup({
      id: new FormControl(''),
      nombre: new FormControl('', [Validators.required]),
      descripcion: new FormControl('', [Validators.required])
    });
  }

  ngOnInit(): void {
    if (this.tipoPago) {
      this.tipoPagoForm.patchValue(this.tipoPago);
    }
  }

  guardar(tipoPago: TipoPago) {
    if (this.tipoPagoForm.valid) {

      if (!this.tipoPago) {
        tipoPago.id = 0;

        this.tipopagoService.create(tipoPago)
          .subscribe(response => {
            Swal.fire({
              title: "Guardado",
              text: 'Tipo de pago creado',
              icon: "success"
            });

            this.editCrear.emit(false);
          }, error => {

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
            Swal.fire({
              title: "Guardado",
              text: 'Tipo de pago actualizado',
              icon: "success"
            });

            this.editCrear.emit(false);
          }, error => {
            // Manejo de errores
            console.error('Error al modificar el tipo de pago:', error);
            Swal.fire({
              title: "Error",
              text: 'Error al modificar el tipo de pago',
              icon: "error"
            });
          });
      }

    } else {

      Swal.fire({
        title: "Error",
        text: 'Formulario inválido. Verifique los datos ingresados.',
        icon: "error"
      });
      console.error('Formulario inválido');
    }
  }

}
