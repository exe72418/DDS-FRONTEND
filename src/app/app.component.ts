import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ProductosServiceService } from './services/productos-service.service';
import { Producto } from './models/producto';
import { CustomComponentsModule } from './modules/custom-components.module';
import { Pedido } from './models/pedido';
import { LineaDeProducto } from './models/lineaProducto';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { CargaService } from './services/carga.service';
import { LoginComponent } from './login/login.component';
import { MatDialog } from '@angular/material/dialog';
import { AuthservicesService } from './services/authservices.service';


@Component({
  selector: 'app-root',
  ///providers: [Store],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  dialog = inject(MatDialog)

  productos!: Producto[];
  title = 'fast';
  pedido!: Pedido;

  constructor(private _productoService: ProductosServiceService, private cargaService: CargaService, private router: Router, private authService: AuthservicesService
  ) {

  }

  ngOnInit(): void {
    this.router.navigate(['home'])
  }
  abrirLogin() {
    this.dialog.open(LoginComponent)
  }
    

  navigateCarrito() {
    // this.router.navigate(['/home'], {
    //   replaceUrl: true, state: {pedido: this.pedido}
    // });
  }
  
  isAdmin(): boolean {
    return this.authService.getUserData()?.role === 'admin';
  } 

  isCliente(): boolean {
    return this.authService.getUserData()?.role === 'cliente';
  }

}
