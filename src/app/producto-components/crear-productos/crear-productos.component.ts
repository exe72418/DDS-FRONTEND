import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Producto } from '../../models/producto';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TipoproductoService } from '../../services/tipoproducto.service';
import { TipoProducto } from '../../models/tipoProducto';
import { ProductosServiceService } from '../../services/productos-service.service';
import Swal from 'sweetalert2';
import { CargaService } from '../../services/carga.service';

@Component({
  selector: 'app-crear-productos',
  templateUrl: './crear-productos.component.html',
  styleUrl: './crear-productos.component.css'
})
export class CrearProductosComponent implements OnInit {

  @Input() producto: Producto | null = null;

  @Output() editCrear: EventEmitter<boolean> = new EventEmitter();

  prodForm: FormGroup;
  tiposProducto: TipoProducto[] = [];

  constructor(
    private tipoproductoService: TipoproductoService,
    private cargaService: CargaService,
    private _productoService: ProductosServiceService
  ) {
    this.prodForm = new FormGroup({
      codigo: new FormControl(''),
      descripcion: new FormControl('', [Validators.required]),
      stock: new FormControl('', [Validators.required]),
      precio: new FormControl('', [Validators.required]),
      tipoProducto: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {

    if (this.producto?.codigo) {
      this._productoService.findOne(this.producto.codigo).subscribe((prodBackend) => {
        this.prodForm.patchValue(prodBackend);
      });
    } else {
      this.prodForm.reset(); 
    }

    this.tipoproductoService.getTiposDeProductoActivos().subscribe((data: any) => {
      this.tiposProducto = data['data'].map((tipoprod: TipoProducto) => {
        const tipoProductoFormateado: TipoProducto = {
          id: tipoprod.id,
          nombre: tipoprod.nombre,
          disponible: tipoprod.disponible
        };
        return tipoProductoFormateado;
      });
    });
  }

  guardar(prod: Producto) {
    const esEdicion = !!this.producto && !!this.producto.codigo;

    this.cargaService.show();

    if (esEdicion) {

      this._productoService.update(prod).subscribe({
        next: () => {
          this.cargaService.hide();
          Swal.fire({
            title: "Guardado",
            text: "Producto actualizado",
            icon: "success"
          });
          this.editCrear.emit(false);
        },
        error: (error) => {
          this.cargaService.hide();
          console.error('Error al modificar el producto:', error);
          Swal.fire({
            title: "Error",
            text: "Error al modificar el producto",
            icon: "error"
          });
        }
      });

    } else {

      prod.codigo = 0;

      this._productoService.save(prod).subscribe({
        next: () => {
          this.cargaService.hide();
          Swal.fire({
            title: "Guardado",
            text: "Producto creado",
            icon: "success"
          });
          this.editCrear.emit(false);
        },
        error: (error) => {
          this.cargaService.hide();
          console.error('Error al crear el producto:', error);
          Swal.fire({
            title: "Error",
            text: "Error al crear el producto",
            icon: "error"
          });
        }
      });
    }
  }
}
