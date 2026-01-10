import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ZonaService } from '../../services/zona.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Zona } from '../../models/zona';
import Swal from 'sweetalert2';
// Asegurate que CargaService esté importado correctamente
import { CargaService } from '../../services/carga.service';

@Component({
  selector: 'app-crear-zonas',
  templateUrl: './crear-zonas.component.html',
  styleUrls: ['./crear-zonas.component.css']
})
export class CrearZonasComponent implements OnInit {

  @Input() zona!: Zona;
  @Output() editCrear: EventEmitter<boolean> = new EventEmitter();
  zonaForm!: FormGroup;

  constructor(private zonaService: ZonaService, private cargaService: CargaService) {
    this.zonaForm = new FormGroup({
      id: new FormControl(''),
      nombre: new FormControl('', [Validators.required]),
      descripcion: new FormControl('', [Validators.required])
    });
  }

  back() {
    this.editCrear.emit(false)
  }

  ngOnInit(): void {
    if (this.zona) {
      this.zonaForm.patchValue(this.zona);
    }
  }

  guardar(zona: Zona) {
    if (this.zonaForm.valid) {
      this.cargaService.show();
      
      if (!this.zona) {
        // CREAR
        zona.id = 0; // O undefined, dependiendo de tu backend, pero 0 suele funcionar si se ignora en el create

        this.zonaService.create(zona)
          .subscribe(response => {
            this.cargaService.hide();
            Swal.fire({
              title: "Guardado",
              text: 'Zona creada correctamente',
              icon: "success"
            });

            this.editCrear.emit(false);
          }, error => {
            this.cargaService.hide();
            console.error('Error al crear la zona:', error);
            Swal.fire({
              title: "Error",
              text: 'Error al crear la zona',
              icon: "error"
            });
          });

      } else {
        // ACTUALIZAR
        // Aseguramos que el ID venga del objeto original si el form no lo tiene
        zona.id = this.zona.id; 

        this.zonaService.update(zona)
          .subscribe(response => {
            this.cargaService.hide();
            Swal.fire({
              title: "Guardado",
              text: 'Zona actualizada correctamente',
              icon: "success"
            });

            this.editCrear.emit(false);
          }, error => {
            this.cargaService.hide();
            console.error('Error al modificar la zona:', error);
            Swal.fire({
              title: "Error",
              text: 'Error al modificar la zona',
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