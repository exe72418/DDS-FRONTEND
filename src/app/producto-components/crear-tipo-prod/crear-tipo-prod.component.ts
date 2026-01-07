import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TipoproductoService } from '../../services/tipoproducto.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TipoProducto } from '../../models/tipoProducto';
import Swal from 'sweetalert2';
import { CustomComponentsModule } from '../../modules/custom-components.module';
import { CargaService } from '../../services/carga.service';

@Component({
  selector: 'app-crear-tipo-prod',
  templateUrl: './crear-tipo-prod.component.html',
  styleUrl: './crear-tipo-prod.component.css'
})
export class CrearTipoProdComponent implements OnInit {

  @Input() tipoProd!: TipoProducto;
  @Output() editCrear: EventEmitter<boolean> = new EventEmitter();
  tipoProdForm!: FormGroup;

  constructor(private tipoproductoService: TipoproductoService, private cargaService: CargaService) {
    this.tipoProdForm = new FormGroup({
      id: new FormControl(''),
      nombre: new FormControl('', [Validators.required]),
    })
  }

  ngOnInit(): void {
    if (this.tipoProd != null) {
      this.tipoProdForm.patchValue(this.tipoProd);
    }
  }

  back() {
    this.editCrear.emit(false)
  }

  guardar(tipoProducto: TipoProducto) {
    if (this.tipoProdForm.valid) {
      this.cargaService.show();
      if (!this.tipoProd) {
        tipoProducto.id = 0;
        this.tipoproductoService.create(tipoProducto)
          .subscribe(response => {
            this.cargaService.hide();
            Swal.fire({
              title: "Guardado",
              text: 'Tipo de producto creado',
              icon: "success"
            });
            this.editCrear.emit(false);
          }, error => {
            this.cargaService.hide();
            console.error('Error al crear el tipo de producto:', error);
          Swal.fire({
              title: "Error",
              text: 'Error al crear el tipo de producto',
              icon: "error"
            });
          });
      } else {
        this.tipoproductoService.update(tipoProducto)
          .subscribe(response => {
            this.cargaService.hide();
            Swal.fire({
              title: "Guardado",
              text: "Tipo de producto actualizado",
              icon: "success"
            });
            this.editCrear.emit(false);

          }, error => {
            this.cargaService.hide();
            console.error('Error al modificar el Tipo de producto:', error);
            Swal.fire({
              title: "Error",
              text: 'Error al modificar el tipo de producto',
              icon: "error"
            });
          });
      }

    } else {
      console.error('Formulario inválido');
    }
  }

}
