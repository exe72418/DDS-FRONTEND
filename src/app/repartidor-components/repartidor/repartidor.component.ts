import { Component, OnInit, OnDestroy } from '@angular/core'; 
import { RepartidorService } from '../../services/repartidor.service';
import { Repartidor } from '../../models/repartidor';
import Swal from 'sweetalert2';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CargaService } from '../../services/carga.service';
import { BreakpointService } from '../../services/breakpoint.service';
import { Subscription } from 'rxjs'; 

@Component({
  selector: 'app-repartidor',
  templateUrl: './repartidor.component.html',
  styleUrl: './repartidor.component.css'
})
export class RepartidorComponent implements OnInit, OnDestroy {

  crearEditarMode: boolean = false;
  repartidorSelected: Repartidor | null = null;
  repartidorForm!: FormGroup;

  repartidores: Repartidor[] = [];

  isMobile: boolean = false;
  private resizeSub!: Subscription;

  constructor(
    private repartidorService: RepartidorService,
    private cargaService: CargaService,
    private breakpointService: BreakpointService 
  ) {}

  ngOnInit(): void {
    this.resizeSub = this.breakpointService.isMobile$.subscribe(mobile => {
      this.isMobile = mobile;
    });

    this.repartidorForm = new FormGroup({
      id: new FormControl('', [Validators.required]),
      cuit: new FormControl('', [Validators.required]),
      apellidoNombre: new FormControl('', [Validators.required]),
      vehiculo: new FormControl('', [Validators.required]),
      zona: new FormControl('', [Validators.required]),
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

    this.repartidorService.getAll().subscribe({
      next: (data: any) => {
        this.repartidores = data['data'].map((repartidor: Repartidor) => {
          return {
            id: repartidor.id,
            cuit: repartidor.cuit,
            apellidoNombre: repartidor.apellidoNombre,
            vehiculo: repartidor.vehiculo,
            zona: repartidor.zona,
            disponible: repartidor.disponible
          };
        });
      },
      error: (error) => {
        console.error('Error al cargar repartidores:', error);
        this.cargaService.hide();
        Swal.fire({
          title: "Error",
          text: "No se pudieron cargar los repartidores",
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
    this.repartidorSelected = null;
    this.search();
  }

  new() {
    this.repartidorSelected = null;
    this.crearEditarMode = true;
  }

  editRepartidor(repartidor: Repartidor) {
    this.repartidorSelected = repartidor;
    this.crearEditarMode = true;
  }

  deleteRepartidor(repartidor: Repartidor) {
    Swal.fire({
      title: "Atencion?",
      text: "Deseas dar de baja el repartidor " + repartidor.apellidoNombre,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si"
    }).then((result) => {
      if (result.isConfirmed) {
        this.cargaService.show();
        this.repartidorService.delete(repartidor.id).subscribe(() => {
          this.cargaService.hide();
          Swal.fire({
            title: "Repartidor dado de baja",
            text: "",
            icon: "success"
          });
          this.search();
        }, (error) => {
          this.cargaService.hide();
          Swal.fire({
            title: "Repartidor no se dio de baja",
            text: error.message,
            icon: "error"
          });
        });
      }
    });
  }
}