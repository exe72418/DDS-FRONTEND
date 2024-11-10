import { Component, OnInit } from '@angular/core';
import { CustomComponentsModule } from '../../modules/custom-components.module';
import { CrearProductosComponent } from "../crear-productos/crear-productos.component";
import { ProductosServiceService } from '../../services/productos-service.service';
import { Producto } from '../../models/producto';
import Swal from 'sweetalert2';
import { TipoProducto } from '../../models/tipoProducto';
import { TipoproductoService } from '../../services/tipoproducto.service';


@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.css'
})
export class ProductosComponent implements OnInit {

  tiposProducto: TipoProducto[] | undefined;


  precioMinimo: number | null = null;
  precioMaximo: number | null = null;
  prodSelected!: Producto;
  crearEditarMode: boolean = false;
  productos!: Producto[];
  nombreString!: string;
  tipoProductoSelect!: TipoProducto;
  precio!: number;

  constructor(private _productoService: ProductosServiceService, private tipoproductoService: TipoproductoService) {

  }
  ngOnInit(): void {
    this.search();
    this.tipoproductoService.getAll().subscribe((data: any) => {
      this.tiposProducto = data['data'].map((tipoprod: TipoProducto) => {
        const tipoProductoFormateado: TipoProducto = {
          id: tipoprod.id,
          nombre: tipoprod.nombre,
          disponible: tipoprod.disponible
        };
        return tipoProductoFormateado;
      });
    })
  }
  changeEditCreate() {
    this.crearEditarMode = false;
    this.search();
  }

  buscarPorPrecio() {

  }

  buscar() {
    this._productoService.getProductosByFilters(this.nombreString, this.tipoProductoSelect, this.precioMinimo, this.precioMaximo).subscribe((prodFiltrado) => {
      this.productos = prodFiltrado
    })
  }


  search() {
    this._productoService.getAll().subscribe((productos) => {
      this.productos = productos;
    })
  }

  deleteProduct(prod: Producto) {
    Swal.fire({
      title: "Atencion?",
      text: "Deseas borrar el producto " + prod.descripcion,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si"
    }).then((result) => {
      if (result.isConfirmed) {
        this._productoService.delete(prod).subscribe((prod) => {
          Swal.fire({
            title: "Producto borrado",
            text: "",
            icon: "success"
          });
          this.search();
        }, (error) => {
          Swal.fire({
            title: "Producto no se borro",
            text: error.message,
            icon: "error"
          });
        })
      }
    });
  }
  editProduct(prod: Producto) {
    this.crearEditarMode = true;
    this.prodSelected = prod;
  }
  new() {
    this.crearEditarMode = true;
  }

}
