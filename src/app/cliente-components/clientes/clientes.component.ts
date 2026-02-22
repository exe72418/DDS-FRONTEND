import { Cliente } from '../../models/cliente';
import { Component, OnInit, OnDestroy } from '@angular/core'; 
import { ClienteService } from '../../services/cliente.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CargaService } from '../../services/carga.service';
import { HttpClient } from '@angular/common/http';
import { BreakpointService } from '../../services/breakpoint.service'; 
import { Subscription } from 'rxjs'; 
import Swal from 'sweetalert2';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrl: './clientes.component.css'
})
export class ClientesComponent implements OnInit, OnDestroy {

  crearEditarMode: boolean = false;
  clienteSelected: Cliente | null = null;
  clienteForm!: FormGroup;
  clientes!: Cliente[];

  esMobile: boolean = false;
  private resizeSub!: Subscription;

  constructor(
    private clienteService: ClienteService,
    private cargaService: CargaService,
    private http: HttpClient,
    private breakpointService: BreakpointService 
  ) { }

  ngOnInit(): void {
    this.resizeSub = this.breakpointService.isMobile$.subscribe({
      next: (mobile) => {
        this.esMobile = mobile;
      }
    });

    this.clienteForm = new FormGroup({
      id: new FormControl('', [Validators.required]),
      apellidoNombre: new FormControl('', [Validators.required]),
      telefono: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      domicilio: new FormControl('', [Validators.required]),
      cuit: new FormControl('', [Validators.required]),
      disponible: new FormControl('', [Validators.required]),
      zona: new FormControl('', [Validators.required])
    });

    this.search();
  }

  ngOnDestroy(): void {
    if (this.resizeSub) {
      this.resizeSub.unsubscribe();
    }
  }

  search() {
    this.cargaService.show();

    this.clienteService.getAll().subscribe({
      next: (data: any) => {
        this.clientes = data['data'].map((cliente: Cliente) => {
          return {
            id: cliente.id,
            apellidoNombre: cliente.apellidoNombre,
            telefono: cliente.telefono,
            email: cliente.email,
            domicilio: cliente.domicilio,
            cuit: cliente.cuit,
            disponible: cliente.disponible,
            zona: cliente.zona
          };
        });
      },
      error: (error) => {
        console.error('Error al cargar clientes:', error);
        this.cargaService.hide(); 
        Swal.fire({
          title: "Error",
          text: "No se pudieron cargar los clientes",
          icon: "error"
        });
      },
      complete: () => {
        this.cargaService.hide(); 
      }
    });
  }

  changeEditCreate() {
    this.crearEditarMode = false;
    this.clienteSelected = null; 
    this.search();
  }

  new() {
    this.clienteSelected = null; 
    this.crearEditarMode = true;
  }

  editCliente(cliente: Cliente) {
    this.clienteSelected = cliente;
    this.crearEditarMode = true;
  }

  deleteCliente(cliente: Cliente) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Deseas dar de baja el cliente ' + cliente.apellidoNombre,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, borrarlo'
    }).then((result) => {
      if (result.isConfirmed) {
        this.cargaService.show();
        this.clienteService.delete(cliente.id).subscribe({
          next: () => {
            this.cargaService.hide();
            Swal.fire(
              'Eliminado',
              'El cliente ha sido dado de baja.',
              'success'
            );
            this.search();
          },
          error: (error) => {
            this.cargaService.hide();
            Swal.fire(
              'Error al dar de baja',
              error.message,
              'error'
            );
          }
        });
      }
    });
  }
}