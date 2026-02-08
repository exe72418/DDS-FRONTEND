import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductosServiceService } from './services/productos-service.service';
import { Producto } from './models/producto';
import { Pedido } from './models/pedido';
import { CargaService } from './services/carga.service';
import { LoginComponent } from './login/login.component';
import { MatDialog } from '@angular/material/dialog';
import { AuthservicesService } from './services/authservices.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  dialog = inject(MatDialog)

  productos!: Producto[];
  title = 'fast';
  pedido!: Pedido;
  
  menuOpen: boolean = false;

  constructor(
    private _productoService: ProductosServiceService, 
    private cargaService: CargaService, 
    private router: Router, 
    private authService: AuthservicesService
  ) {}

  ngOnInit(): void {
  }

  abrirLogin() {
    this.dialog.open(LoginComponent);
    this.menuOpen = false; 
  }
    
  navigateCarrito() {
     this.router.navigate(['/carrito']);
     this.menuOpen = false;
  }
  
  isAdmin(): boolean {
    return this.authService.getUserData()?.role === 'admin';
  } 

  isCliente(): boolean {
    return this.authService.getUserData()?.role === 'cliente';
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu() {
    this.menuOpen = false;
  }
}