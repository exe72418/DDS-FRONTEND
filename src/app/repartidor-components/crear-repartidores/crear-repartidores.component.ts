import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RepartidorService } from '../../services/repartidor.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Repartidor } from '../../models/repartidor';
import Swal from 'sweetalert2';
import { CustomComponentsModule } from '../../modules/custom-components.module';
import { CargaService } from '../../services/carga.service';

@Component({
  selector: 'app-crear-repartidores',
  templateUrl: './crear-repartidores.component.html',
  styleUrl: './crear-repartidores.component.css'
})
export class CrearRepartidoresComponent implements OnInit {

  @Input() repartidor!: Repartidor;
  @Output() editCrear: EventEmitter<boolean> = new EventEmitter();
  repartidorForm!: FormGroup;

  constructor(private repartidorService: RepartidorService, private cargaService: CargaService) {
    this.repartidorForm = new FormGroup({
      id: new FormControl(''),
      cuit: new FormControl('', [Validators.required]),
      apellidoNombre: new FormControl('', [Validators.required]),
      vehiculo: new FormControl('', [Validators.required]),
      zona: new FormControl('', [Validators.required]),
    })
  }

  ngOnInit(): void {
    if (this.repartidor != null) {
      this.repartidorForm.patchValue(this.repartidor);
    }
  }
  back() {
    this.editCrear.emit(false)
  }

  guardar(repartidor: Repartidor) {
    if (this.repartidorForm.valid) {
      this.cargaService.show();
      if (!this.repartidor) {
        repartidor.id = 0;
        this.repartidorService.create(repartidor)
          .subscribe(response => {
            this.cargaService.hide();
            Swal.fire({
              title: "Guardado",
              text: 'Repartidor creado',
              icon: "success"
            });
            this.editCrear.emit(false);
          }, error => {
            this.cargaService.hide();
            console.error('Error al crear el repartidor:', error);
          });
      } else {
        this.repartidorService.update(repartidor)
          .subscribe(response => {
            this.cargaService.hide();
            Swal.fire({
              title: "Guardado",
              text: "Repartidor guardado",
              icon: "success"
            });
            this.editCrear.emit(false);

          }, error => {
            this.cargaService.hide();
            console.error('Error al modificar el Repartidor:', error);
          });
      }

    } else {
      console.error('Formulario inválido');
    }
  }

}
