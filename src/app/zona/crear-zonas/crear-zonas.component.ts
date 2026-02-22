import { Component, EventEmitter, Input, OnInit, Output, OnDestroy } from '@angular/core'; 
import { ZonaService } from '../../services/zona.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Zona } from '../../models/zona';
import Swal from 'sweetalert2';
import { CargaService } from '../../services/carga.service';
import { BreakpointService } from '../../services/breakpoint.service'; 
import { Subscription } from 'rxjs'; 

@Component({
  selector: 'app-crear-zonas',
  templateUrl: './crear-zonas.component.html',
  styleUrls: ['./crear-zonas.component.css']
})
export class CrearZonasComponent implements OnInit, OnDestroy {

  @Input() zona!: Zona;
  @Output() editCrear: EventEmitter<boolean> = new EventEmitter();
  zonaForm!: FormGroup;

  isMobile: boolean = false;
  private resizeSub!: Subscription;

  constructor(
    private zonaService: ZonaService, 
    private cargaService: CargaService,
    private breakpointService: BreakpointService 
  ) {
    this.zonaForm = new FormGroup({
      id: new FormControl(''),
      nombre: new FormControl('', [Validators.required]),
      descripcion: new FormControl('', [Validators.required])
    });
  }

  ngOnInit(): void {
    this.resizeSub = this.breakpointService.isMobile$.subscribe({
      next: (mobile) => {
        this.isMobile = mobile;
      }
    });

    if (this.zona) {
      this.zonaForm.patchValue(this.zona);
    }
  }

  ngOnDestroy(): void {
    if (this.resizeSub) {
      this.resizeSub.unsubscribe();
    }
  }

  back() {
    this.editCrear.emit(false)
  }

  guardar(zona: Zona) {
    if (this.zonaForm.valid) {
      this.cargaService.show();
      
      if (!this.zona) {
        zona.id = 0; 

        this.zonaService.create(zona)
          .subscribe({
            next: (response) => {
              this.cargaService.hide();
              Swal.fire({
                title: "Guardado",
                text: 'Zona creada correctamente',
                icon: "success"
              });

              this.editCrear.emit(false);
            },
            error: (error) => {
              this.cargaService.hide();
              Swal.fire({
                title: "Error",
                text: 'Error al crear la zona',
                icon: "error"
              });
            }
          });

      } else {
        zona.id = this.zona.id; 

        this.zonaService.update(zona)
          .subscribe({
            next: (response) => {
              this.cargaService.hide();
              Swal.fire({
                title: "Guardado",
                text: 'Zona actualizada correctamente',
                icon: "success"
              });

              this.editCrear.emit(false);
            },
            error: (error) => {
              this.cargaService.hide();
              Swal.fire({
                title: "Error",
                text: 'Error al modificar la zona',
                icon: "error"
              });
            }
          });
      }

    } else {
      this.cargaService.hide();
      Swal.fire({
        title: "Error",
        text: 'Formulario inválido. Verifique los datos ingresados.',
        icon: "error"
      });
    }
  }

}