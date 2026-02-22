import { Component, EventEmitter, Input, OnInit, Output, OnDestroy } from '@angular/core';
import { RepartidorService } from '../../services/repartidor.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Repartidor } from '../../models/repartidor';
import { Zona } from '../../models/zona';
import { ZonaService } from '../../services/zona.service';
import { CargaService } from '../../services/carga.service';
import { BreakpointService } from '../../services/breakpoint.service'; 
import { Subscription } from 'rxjs'; 
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crear-repartidores',
  templateUrl: './crear-repartidores.component.html',
  styleUrl: './crear-repartidores.component.css'
})
export class CrearRepartidoresComponent implements OnInit, OnDestroy {

  @Input() repartidor: Repartidor | null = null;
  @Output() editCrear: EventEmitter<boolean> = new EventEmitter();

  repartidorForm: FormGroup;
  zonas: Zona[] = [];

  isMobile: boolean = false;
  private resizeSub!: Subscription;

  constructor(
    private repartidorService: RepartidorService,
    private zonaService: ZonaService,
    private cargaService: CargaService,
    private breakpointService: BreakpointService 
  ) {
    this.repartidorForm = new FormGroup({
      id: new FormControl(''),
      cuit: new FormControl('', [Validators.required]),
      apellidoNombre: new FormControl('', [Validators.required]),
      vehiculo: new FormControl('', [Validators.required]),
      zona: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.resizeSub = this.breakpointService.isMobile$.subscribe({
      next: (mobile) => {
        this.isMobile = mobile;
      }
    });

    this.zonaService.getZonasActivas().subscribe({
      next: (response: any) => {
        this.zonas = response.data || response;
      }
    });

    if (this.repartidor?.id) {
      this.repartidorForm.patchValue(this.repartidor);
    } else {
      this.repartidorForm.reset();
    }
  }

  ngOnDestroy(): void {
    if (this.resizeSub) {
      this.resizeSub.unsubscribe();
    }
  }

  back() {
    this.editCrear.emit(false);
  }

  guardar(repartidor: Repartidor) {
    if (!this.repartidorForm.valid) {
      Swal.fire({
        title: "Error",
        text: 'Formulario inválido. Verifique los campos.',
        icon: "warning"
      });
      return;
    }

    const esEdicion = !!this.repartidor && !!this.repartidor.id;

    this.cargaService.show();

    if (!esEdicion) {
      repartidor.id = 0;
      this.repartidorService.create(repartidor).subscribe({
        next: () => {
          this.cargaService.hide();
          Swal.fire({
            title: "Guardado",
            text: 'Repartidor creado',
            icon: "success"
          });
          this.editCrear.emit(false);
        },
        error: (error) => {
          this.cargaService.hide();
          Swal.fire({
            title: "Error",
            text: 'Error al crear el repartidor',
            icon: "error"
          });
        }
      });
    } else {
      repartidor.id = this.repartidor!.id;
      this.repartidorService.update(repartidor).subscribe({
        next: () => {
          this.cargaService.hide();
          Swal.fire({
            title: "Guardado",
            text: "Repartidor actualizado",
            icon: "success"
          });
          this.editCrear.emit(false);
        },
        error: (error) => {
          this.cargaService.hide();
          Swal.fire({
            title: "Error",
            text: 'Error al modificar el repartidor',
            icon: "error"
          });
        }
      });
    }
  }
}