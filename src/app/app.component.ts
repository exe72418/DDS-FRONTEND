import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ProductosServiceService } from './services/productos-service.service';
import { Producto } from './models/producto';
import { CustomComponentsModule } from './modules/custom-components.module';
import { Pedido } from './models/pedido';
import { LineaDeProducto } from './models/lineaProducto';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-root',
  ///providers: [Store],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{

  productos!:Producto[];
  title = 'fast';
  pedido!: Pedido;

  constructor(private _productoService : ProductosServiceService,
              //private store:Store,
              private router: Router,
  ){

  }

  ngOnInit(): void {

    console.log('se ejecuta el console.log')

  }
  
  navigateCarrito() {
    // this.router.navigate(['/home'], {
    //   replaceUrl: true, state: {pedido: this.pedido}
    // });
  }

}
