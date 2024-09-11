import { Component, OnInit } from '@angular/core';
import { CustomComponentsModule } from '../modules/custom-components.module';
import { CrearProductosComponent } from "../crear-productos/crear-productos.component";
import { ProductosServiceService } from '../services/productos-service.service';
import { Producto } from '../models/producto';

//import { addIcons } from "ionicons";

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CustomComponentsModule, CrearProductosComponent],
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
    this._productoService.getAll().subscribe((productos)=>{
      console.log(productos)
      this.productos = productos;
    })  
  }
  changeEditCreate() {
    this.crearEditarMode = false;
  }

  deleteProduct(_t17: any) {
  throw new Error('Method not implemented.');
  }
  editProduct(prod: Producto) {
  this.crearEditarMode = true;
  this.prodSelected = prod;
  }
  new() {
    this.crearEditarMode = true;
  }

}
