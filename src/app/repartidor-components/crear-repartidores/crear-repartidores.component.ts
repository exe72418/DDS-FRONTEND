import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RepartidorService } from '../../services/repartidor.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Repartidor } from '../../models/repartidor';
import { Zona } from '../../models/zona'; // Importamos el modelo Zona
import { ZonaService } from '../../services/zona.service'; // Importamos el servicio Zona
import Swal from 'sweetalert2';
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
  zonas: Zona[] = []; // Lista para el dropdown

  // Inyectamos ZonaService
  constructor(
    private repartidorService: RepartidorService, 
    private zonaService: ZonaService,
    private cargaService: CargaService
  ) {
    this.repartidorForm = new FormGroup({
      id: new FormControl(''),
      cuit: new FormControl('', [Validators.required]),
      apellidoNombre: new FormControl('', [Validators.required]),
      vehiculo: new FormControl('', [Validators.required]),
      zona: new FormControl('', [Validators.required]),
    })
  }

  ngOnInit(): void {
    // 1. Cargar las zonas activas para el dropdown
    this.zonaService.getZonasActivas().subscribe((response: any) => {
        // Dependiendo de si tu back devuelve { data: [...] } o [...] directo
        this.zonas = response.data || response;
    });

    // 2. Si estamos editando, llenar el formulario
    if (this.repartidor) {
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
        // CREAR
        repartidor.id = 0;
        this.repartidorService.create(repartidor).subscribe(response => {
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
            Swal.fire({
                title: "Error",
                text: 'Error al crear el repartidor',
                icon: "error"
              });
          });
      } else {
        // EDITAR
        // Aseguramos mantener el ID original
        repartidor.id = this.repartidor.id;
        
        this.repartidorService.update(repartidor).subscribe(response => {
            this.cargaService.hide();
            Swal.fire({
              title: "Guardado",
              text: "Repartidor actualizado",
              icon: "success"
            });
            this.editCrear.emit(false);
          }, error => {
            this.cargaService.hide();
            console.error('Error al modificar el Repartidor:', error);
            Swal.fire({
                title: "Error",
                text: 'Error al modificar el repartidor',
                icon: "error"
              });
          });
      }

    } else {
      console.error('Formulario inválido');
      Swal.fire({
        title: "Error",
        text: 'Formulario inválido. Verifique los campos.',
        icon: "warning"
      });
    }
  }
}