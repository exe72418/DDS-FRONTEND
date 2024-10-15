import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RepartidorService } from '../../services/repartidor.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Repartidor } from '../../models/repartidor';
import Swal from 'sweetalert2';
import { CustomComponentsModule } from '../../modules/custom-components.module';

@Component({
  selector: 'app-crear-repartidores',
  templateUrl: './crear-repartidores.component.html',
  styleUrl: './crear-repartidores.component.css'
})
export class CrearRepartidoresComponent implements OnInit {

  @Input() repartidor!: Repartidor;
  @Output() editCrear: EventEmitter<boolean> = new EventEmitter();
  repartidorForm!: FormGroup;

  constructor(private repartidorService: RepartidorService) {
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

  guardar(repartidor: Repartidor) {
    if (this.repartidorForm.valid) {
      if (!this.repartidor) {
        repartidor.id = 0;
        // Aquí puedes enviar los datos al servidor usando HttpClient
        this.repartidorService.create(repartidor)
          .subscribe(response => {
            // Puedes realizar acciones adicionales después de crear el cliente
            this.editCrear.emit(false);
          }, error => {
            console.error('Error al crear el repartidor:', error);
          });
      } else {
        // Aquí puedes enviar los datos al servidor usando HttpClient
        this.repartidorService.update(repartidor)
          .subscribe(response => {
            Swal.fire({
              title: "Guardado",
              text: "Repartidor guardado",
              icon: "success"
            });
            this.editCrear.emit(false);

            // Puedes realizar acciones adicionales después de crear el cliente
          }, error => {
            console.error('Error al modificar el Repartidor:', error);
          });
      }

    } else {
      // Manejar errores de validación
      console.error('Formulario inválido');
    }
  }

}
