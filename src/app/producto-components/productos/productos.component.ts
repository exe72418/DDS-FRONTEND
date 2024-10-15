import { Component, OnInit } from '@angular/core';
import { CustomComponentsModule } from '../../modules/custom-components.module';
import { CrearProductosComponent } from "../crear-productos/crear-productos.component";
import { ProductosServiceService } from '../../services/productos-service.service';
import { Producto } from '../../models/producto';
import Swal from 'sweetalert2';

//import { addIcons } from "ionicons";

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.css'
})
export class ProductosComponent implements OnInit {


  prodSelected!: Producto;
  crearEditarMode: boolean = false;
  productos! : Producto[];

  constructor(private _productoService : ProductosServiceService){

  }
  ngOnInit(): void {
    this.search();
  }
  changeEditCreate() {
    this.crearEditarMode = false;
  }
  search(){
    this._productoService.getAll().subscribe((productos)=>{
      console.log(productos)
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
        this._productoService.delete(prod).subscribe((prod)=>{
          Swal.fire({
            title: "Producto borrado",
            text: "",
            icon: "success"
          });
          this.search();
        },(error)=>{
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
