import { Component, OnInit, OnDestroy } from '@angular/core'; 
import { ProductosServiceService } from '../../services/productos-service.service';
import { Producto } from '../../models/producto';
import Swal from 'sweetalert2';
import { TipoProducto } from '../../models/tipoProducto';
import { TipoproductoService } from '../../services/tipoproducto.service';
import { CargaService } from '../../services/carga.service';
import { BreakpointService } from '../../services/breakpoint.service'; 
import { Subscription } from 'rxjs'; 

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.css'
})
export class ProductosComponent implements OnInit, OnDestroy {

  tiposProducto: TipoProducto[] | undefined;

  precioMinimo: number | null = null;
  precioMaximo: number | null = null;

  prodSelected: Producto | null = null;

  crearEditarMode: boolean = false;
  productos!: Producto[];
  nombreString!: string;
  tipoProductoSelect!: TipoProducto;
  precio!: number;

  isMobile: boolean = false;
  private resizeSub!: Subscription;

  constructor(
    private _productoService: ProductosServiceService,
    private tipoproductoService: TipoproductoService,
    private cargaService: CargaService,
    private breakpointService: BreakpointService 
  ) {}

  ngOnInit(): void {
    this.cargaService.show();
    
    this.resizeSub = this.breakpointService.isMobile$.subscribe({
      next: (mobile) => {
        this.isMobile = mobile;
      }
    });

    this.search();
    this.tipoproductoService.getAll().subscribe({
      next: (data: any) => {
        this.tiposProducto = data['data'].map((tipoprod: TipoProducto) => {
          const tipoProductoFormateado: TipoProducto = {
            id: tipoprod.id,
            nombre: tipoprod.nombre,
            disponible: tipoprod.disponible
          };
          return tipoProductoFormateado;
        });
        this.cargaService.hide();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.resizeSub) {
      this.resizeSub.unsubscribe();
    }
  }

  changeEditCreate() {
    this.crearEditarMode = false;
    this.prodSelected = null; 
    this.search();
  }

  buscarPorPrecio() {
  
  }

buscar() {
    this.cargaService.show(); 
    
    this._productoService
      .getProductosByFilters(this.nombreString, this.tipoProductoSelect, this.precioMinimo, this.precioMaximo, null)
      .subscribe({
        next: (prodFiltrado) => {
          this.productos = prodFiltrado;
        },
        error: (err) => {
          console.error('Error al filtrar:', err);
          this.cargaService.hide(); 
          Swal.fire({ title: "Error", text: "Error al buscar productos", icon: "error" });
        },
        complete: () => {
          this.cargaService.hide(); 
        }
      });
  }

search() {
    this.cargaService.show();

    this._productoService.getAll().subscribe({
      next: (response: any) => {
        this.productos = response.data || response; 
      },
      error: (err) => {
        console.error('Error al cargar productos:', err);
        this.cargaService.hide(); 
        Swal.fire({
          title: "Error",
          text: "No se pudieron cargar los productos",
          icon: "error"
        });
      },
      complete: () => {
        this.cargaService.hide(); 
      }
    });
  }

  deleteProduct(prod: Producto) {
    Swal.fire({
      title: "Atencion?",
      text: "Deseas dar de baja el producto " + prod.descripcion,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, dar de baja!",
    }).then((result) => {
      if (result.isConfirmed) {
        this.cargaService.show();
        this._productoService.delete(prod).subscribe({
          next: () => {
            this.cargaService.hide();
            Swal.fire({
              title: "Producto Dado de baja",
              text: "",
              icon: "success"
            });
            this.search();
          },
          error: () => {
            this.cargaService.hide();
            Swal.fire({
              title: "Error",
              text: "Error al dar de baja el producto",
              icon: "error"
            });
          }
        });
      }
    });
  }

  editProduct(prod: Producto) {
    this.prodSelected = prod;     
    this.crearEditarMode = true;  
  }

  new() {
    this.prodSelected = null;     
    this.crearEditarMode = true;  
  }
}