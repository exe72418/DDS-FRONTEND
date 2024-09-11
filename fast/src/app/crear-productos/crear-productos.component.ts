import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Producto } from '../models/producto';
import { CustomComponentsModule } from '../modules/custom-components.module';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TipoproductoService } from '../services/tipoproducto.service';
import { TipoProducto } from '../models/tipoProducto';
import { ProductosServiceService } from '../services/productos-service.service';

@Component({
  selector: 'app-crear-productos',
  standalone: true,
  imports: [CustomComponentsModule],
  templateUrl: './crear-productos.component.html',
  styleUrl: './crear-productos.component.css'
})
export class CrearProductosComponent implements OnInit {

  @Input() producto! : Producto;
  @Output() editCrear: EventEmitter<boolean> = new EventEmitter();

  prodForm!: FormGroup;
  tiposProducto: TipoProducto[] = [];

  constructor(private tipoproductoService : TipoproductoService, private _productoService : ProductosServiceService){
    this.prodForm = new FormGroup({
      codigo: new FormControl(''),
      descripcion: new FormControl('', [Validators.required]),
      stock: new FormControl('', [Validators.required]),
      precio: new FormControl('', [Validators.required]),
      tipoProducto: new FormControl('', [Validators.required]),
      
    })
  }
  ngOnInit(): void {
    if(this.producto !=null){
      this.prodForm.patchValue(this.producto)
    }  
    this.tipoproductoService.getAll().subscribe((data:any)=>{
      this.tiposProducto =data['data'].map((tipoprod: TipoProducto) => {
        const tipoProductoFormateado: TipoProducto = {
          id: tipoprod.id,
          nombre: tipoprod.nombre,
        };
        return tipoProductoFormateado;
      });
    })
  }


  guardar(prod: Producto) {
    if(this.producto != undefined || this.producto != null){
      if(this.producto.codigo){
        this._productoService.update(prod).subscribe((prodBackend)=>{
          console.log(prodBackend)
        })
      }
    }else{
      console.log(prod)
      this._productoService.save(prod).subscribe((prodBackend)=>{
        console.log(prodBackend)
      })
    }
    
  }
}
