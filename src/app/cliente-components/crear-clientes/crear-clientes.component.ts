import { Component, EventEmitter, Input, OnInit, Output, OnDestroy } from '@angular/core';
import { ClienteService } from '../../services/cliente.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Cliente } from '../../models/cliente';
import { Zona } from '../../models/zona';
import { ZonaService } from '../../services/zona.service';
import Swal from 'sweetalert2';
import { CargaService } from '../../services/carga.service';
import { BreakpointService } from '../../services/breakpoint.service'; 
import { Subscription } from 'rxjs'; 

@Component({
  selector: 'app-crear-clientes',
  templateUrl: './crear-clientes.component.html',
  styleUrl: './crear-clientes.component.css'
})
export class CrearClientesComponent implements OnInit, OnDestroy {

  @Input() cliente: Cliente | null = null;
  @Output() editCrear: EventEmitter<boolean> = new EventEmitter();

  clienteForm: FormGroup;
  zonas: Zona[] = [];

  isMobile: boolean = false;
  private resizeSub!: Subscription;

  constructor(
    private clienteService: ClienteService,
    private zonaService: ZonaService,
    private cargaService: CargaService,
    private breakpointService: BreakpointService
  ) {
    this.clienteForm = new FormGroup({
      id: new FormControl(''),
      apellidoNombre: new FormControl('', [Validators.required]),
      telefono: new FormControl('', [Validators.required]),
      cuit: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      domicilio: new FormControl('', [Validators.required]),
      zona: new FormControl('', [Validators.required])
    });
  }

  ngOnInit() {
    this.resizeSub = this.breakpointService.isMobile$.subscribe(mobile => {
      this.isMobile = mobile;
    });

    this.zonaService.getZonasActivas().subscribe((response: any) => {
      this.zonas = response.data || response;
    });

    if (this.cliente?.id) {
      this.clienteForm.patchValue(this.cliente);
      if (this.cliente.zona) {

      }
    } else {
      this.clienteForm.reset();
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

  guardar(cliente: Cliente) {
    if (!this.clienteForm.valid) {
      Swal.fire({
        title: "Error",
        text: 'Formulario inválido. Verifique los datos ingresados.',
        icon: "error"
      });
      return;
    }

    const esEdicion = !!this.cliente && !!this.cliente.id;

    this.cargaService.show();

    if (!esEdicion) {
      cliente.id = 0;
      this.clienteService.create(cliente).subscribe({
        next: () => {
          this.cargaService.hide();
          Swal.fire({
            title: "Guardado",
            text: 'Cliente creado',
            icon: "success"
          });
          this.editCrear.emit(false);
        },
        error: (error) => {
          this.cargaService.hide();
          console.error('Error al crear el cliente:', error);
          Swal.fire({
            title: "Error",
            text: 'Error al crear el cliente',
            icon: "error"
          });
        }
      });
    } else {
      cliente.id = this.cliente!.id;
      this.clienteService.update(cliente).subscribe({
        next: () => {
          this.cargaService.hide();
          Swal.fire({
            title: "Guardado",
            text: 'Cliente actualizado',
            icon: "success"
          });
          this.editCrear.emit(false);
        },
        error: (error) => {
          this.cargaService.hide();
          console.error('Error al modificar el cliente:', error);
          Swal.fire({
            title: "Error",
            text: 'Error al modificar el cliente',
            icon: "error"
          });
        }
      });
    }
  }
}