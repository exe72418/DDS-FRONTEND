import { Component, OnInit, OnDestroy } from '@angular/core'; 
import { TipoproductoService } from '../../services/tipoproducto.service';
import { TipoProducto } from '../../models/tipoProducto';
import Swal from 'sweetalert2';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CargaService } from '../../services/carga.service';
import { BreakpointService } from '../../services/breakpoint.service';
import { Subscription } from 'rxjs'; 

@Component({
  selector: 'app-tipoproducto',
  templateUrl: './tipoproducto.component.html',
  styleUrl: './tipoproducto.component.css'
})
export class TipoproductoComponent implements OnInit, OnDestroy {

  crearEditarMode: boolean = false;

  tipoProdSelected: TipoProducto | null = null;

  tipoProdForm!: FormGroup;
  tiposProducto: TipoProducto[] = [];

  isMobile: boolean = false;
  private resizeSub!: Subscription;

  constructor(
    private tipoproductoService: TipoproductoService,
    private cargaService: CargaService,
    private breakpointService: BreakpointService 
  ) {}

  ngOnInit(): void {
    this.resizeSub = this.breakpointService.isMobile$.subscribe({
      next: (mobile) => {
        this.isMobile = mobile;
      }
    });

    this.tipoProdForm = new FormGroup({
      id: new FormControl('', [Validators.required]),
      nombre: new FormControl('', [Validators.required]),
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
    
    this.tipoproductoService.getAll().subscribe({
      next: (data: any) => {
        this.tiposProducto = data['data'].map((tipoprod: TipoProducto) => ({
          id: tipoprod.id,
          nombre: tipoprod.nombre,
          disponible: tipoprod.disponible
        }));
      },
      error: (err) => {
        console.error('Error al cargar tipos de producto:', err);
        this.cargaService.hide(); 
        Swal.fire({
          title: "Error",
          text: "No se pudieron cargar los tipos de producto",
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
    this.tipoProdSelected = null; 
    this.search();
  }

  new() {
    this.tipoProdSelected = null; 
    this.crearEditarMode = true;
  }
  
  editProduct(tipoprod: TipoProducto) {
    this.tipoProdSelected = tipoprod;
    this.crearEditarMode = true;
  }

  deleteProduct(tipoprod: TipoProducto) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Deseas dar de baja el tipo de producto ' + tipoprod.nombre,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, Dar de baja!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.cargaService.show();
        this.tipoproductoService.delete(tipoprod.id).subscribe({
          next: () => {
            this.cargaService.hide();
            Swal.fire(
              'Eliminado',
              'El tipo de producto ha sido dado de baja.',
              'success'
            );
            this.search();
          },
          error: () => {
            this.cargaService.hide();
            Swal.fire({
              title: "Error",
              text: 'Error al dar de baja el tipo de producto',
              icon: "error"
            });
          }
        });
      }
    });
  }
}