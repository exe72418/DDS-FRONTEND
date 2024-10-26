import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Pago } from '../../models/pago';
import { CustomComponentsModule } from '../../modules/custom-components.module';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PagoService } from '../../services/pago.service';
import { TipoPago } from '../../models/tipopago';
import { TipopagoService } from '../../services/tipopago.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crear-pago',
  templateUrl: './crear-pago.component.html',
  styleUrl: './crear-pago.component.css'
})
export class CrearPagoComponent {

  @Input() pago!: Pago;
  @Output() editCrear: EventEmitter<boolean> = new EventEmitter();

  pagoForm!: FormGroup;
  tiposPago: TipoPago[] = [];

  constructor(private TipopagoService: TipopagoService, private _pagoService: PagoService) {
    this.pagoForm = new FormGroup({
      id: new FormControl(''),
      fecha: new FormControl('', [Validators.required]),
      tipoPago: new FormControl('', [Validators.required]),

    })
  }
  ngOnInit(): void {
    if (this.pago != null) {
      this.pagoForm.patchValue(this.pago)
    }
    this.TipopagoService.getAll().subscribe((data: any) => {
      this.tiposPago = data['data'].map((tipoPago: TipoPago) => {
        const tipoPagoFormateado: TipoPago = {
          id: tipoPago.id,
          nombre: tipoPago.nombre,
          descripcion: tipoPago.descripcion,
        };
        return tipoPagoFormateado;
      });
    })
  }


  guardar(pag: Pago) {
    if (this.pago != undefined || this.pago != null) {
      if (this.pago.id) {
        this._pagoService.update(pag).subscribe(pagBackend => {
          Swal.fire({
            title: "Guardado",
            text: "Pago actualizado",
            icon: "success"
          });
          this.editCrear.emit(false);

          console.log(pagBackend)
        }, error => {
          console.error('Error al modificar el pago:', error);
        })
      }
    } else {
      console.log(pag)
      pag.id = 0;
      this._pagoService.save(pag).subscribe(pagBackend => {
        Swal.fire({
          title: "Guardado",
          text: "Pago creado",
          icon: "success"
        });
        this.editCrear.emit(false);

        console.log(pagBackend)
      }, error => {
        console.error('Error al crear el pago:', error);
      });
    }
  }
}
