import { Component, OnInit, OnDestroy } from '@angular/core'; 
import { Zona } from '../../models/zona';
import { ZonaService } from '../../services/zona.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CargaService } from '../../services/carga.service';
import { BreakpointService } from '../../services/breakpoint.service';
import { Subscription } from 'rxjs'; 
import Swal from 'sweetalert2';

@Component({
  selector: 'app-zonas',
  templateUrl: './zonas.component.html',
  styleUrls: ['./zonas.component.css']
})
export class ZonasComponent implements OnInit, OnDestroy {
  crearEditarMode: boolean = false;
  zonaSelected!: Zona; 
  zonaForm!: FormGroup;
  zonas: Zona[] = [];

  isMobile: boolean = false;
  private resizeSub!: Subscription;

  constructor(
    private zonaService: ZonaService, 
    private cargaService: CargaService,
    private breakpointService: BreakpointService 
  ) { }

  ngOnInit(): void {
    this.resizeSub = this.breakpointService.isMobile$.subscribe({
      next: (mobile) => {
        this.isMobile = mobile;
      }
    });

    this.zonaForm = new FormGroup({
      id: new FormControl('', [Validators.required]),
      nombre: new FormControl('', [Validators.required]),
    })
    this.search();
  }

  ngOnDestroy(): void {
    if (this.resizeSub) {
      this.resizeSub.unsubscribe();
    }
  }

search() {
    this.cargaService.show();
    
    this.zonaService.getAll().subscribe({
      next: (data: any) => {
        this.zonas = data['data'].map((zona: Zona) => {
          const zonaFormateada: Zona = {
            id: zona.id,
            nombre: zona.nombre,
            descripcion: zona.descripcion,
            disponible: zona.disponible
          };
          return zonaFormateada;
        });
      },
      error: (error) => {
        console.error('Error al cargar zonas:', error);
        this.cargaService.hide();
        Swal.fire({
          title: "Error",
          text: "No se pudieron cargar las zonas",
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
    this.search(); 
  }

  new() {
    this.crearEditarMode = true;
    this.zonaSelected = null!; 
  }

  editarZona(zona: Zona) {
    this.crearEditarMode = true;
    this.zonaSelected = zona;
  }

  borrarZona(zona: Zona) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Deseas dar de baja la zona: ' + zona.nombre,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, dar de baja!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.cargaService.show();
        
        this.zonaService.delete(zona.id!).subscribe({
          next: () => {
            this.cargaService.hide();
            Swal.fire(
              'Eliminado',
              'La zona ha sido dada de baja.',
              'success'
            );
            this.search();
          },
          error: (error) => {
            this.cargaService.hide();
            Swal.fire({
              title: "Error",
              text: 'Error al dar de baja la zona',
              icon: "error"
            });
          }
        });
      }
    });
  }
}