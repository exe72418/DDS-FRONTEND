import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthservicesService } from '../services/authservices.service';
import { Router } from '@angular/router';
import { CargaService } from '../services/carga.service';
import { MatDialogRef } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { Zona } from '../models/zona'; 
import { ZonaService } from '../services/zona.service'; 
import { ClienteService } from '../services/cliente.service'; 
import { Cliente } from '../models/cliente'; 

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'] 
})
export class LoginComponent implements OnInit {

  loginForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  registerForm = new FormGroup({
    username: new FormControl('', Validators.required), 
    password: new FormControl('', Validators.required),
    cuit: new FormControl('', Validators.required),
    apellidoNombre: new FormControl('', Validators.required),
    telefono: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    domicilio: new FormControl('', Validators.required),
    zona: new FormControl(null, Validators.required) 
  });

  isRegister = false;
  isAutenticated!: boolean;
  zonas: Zona[] = []; 
  
  clienteInfo: Cliente | null = null;
  userData: any = null;

  constructor(
    private authService: AuthservicesService, 
    private cargaService: CargaService, 
    private router: Router,  
    public dialogRef: MatDialogRef<LoginComponent>,
    private zonaService: ZonaService,
    private clienteService: ClienteService 
  ) { }

  ngOnInit(): void {
    this.isAutenticated = this.authService.isAuthenticated();
    this.userData = this.authService.getUserData();

    if (this.isAutenticated) {
        this.cargarDatosCliente();
    } else {
        this.zonaService.getZonasActivas().subscribe((response: any) => {
            this.zonas = response.data || response;
        });
    }
  }

  cargarDatosCliente() {
    if (this.isCliente()) {
        this.cargaService.show();
        this.clienteService.getMiPerfil().subscribe({
            next: (data) => {
                this.clienteInfo = data;
                this.cargaService.hide();
            },
            error: () => this.cargaService.hide()
        });
    }
  }

  cambiarRegister() {
    this.isRegister = !this.isRegister;
    this.loginForm.reset();
    this.registerForm.reset();
  }

  logout() {
    this.authService.logout();
    this.isAutenticated = false;
    this.clienteInfo = null;
    this.userData = null;
    this.dialogRef.close();
    this.router.navigate(['home']);
  }

  isAdmin(): boolean {
    return this.authService.getUserData()?.role === 'admin';
  } 
  
  isCliente(){
    return this.authService.getUserData()?.role === 'cliente';
  }

  login() {
    if(this.loginForm.invalid) return;

    const { username, password } = this.loginForm.value;
    this.cargaService.show();

    this.authService.login(username!, password!).subscribe({
        next: (res) => {
            this.cargaService.hide();
            localStorage.setItem('auth_token', res.token);
            this.isAutenticated = true;
            this.userData = this.authService.getUserData();
            
            this.dialogRef.close(); 
            Swal.fire({ 
                title: `Registrado`, 
                icon: "success",
                timer: 1500,
                showConfirmButton: false
            }); 
            
            this.router.navigate(['home']);
        }, 
        error: (error) => { 
            this.cargaService.hide(); 
            Swal.fire({ title: "Error", text: "Credenciales incorrectas", icon: "error" });
        }
    });
  }

  register() {
    if (this.registerForm.invalid) {
        Swal.fire({ title: "Atención", text: "Complete todos los campos requeridos", icon: "warning" });
        return;
    }
    
    this.cargaService.show();

    this.authService.register(this.registerForm.value).subscribe({
        next: () => {
            const { username, password } = this.registerForm.value;
            this.authService.login(username!, password!).subscribe({
                next: (res) => {
                    localStorage.setItem('auth_token', res.token);
                    this.isAutenticated = true;
                    this.dialogRef.close();
                    this.cargaService.hide();
                    Swal.fire({ title: "Cuenta creada!", icon: "success", timer: 1500, showConfirmButton: false }); 
                    this.router.navigate(['home']);
                }
            });
        }, 
        error: (error) => { 
            this.cargaService.hide(); 
            Swal.fire({ title: "Error", text: error.error.message || "No se pudo registrar", icon: "error" });
        }
    });
  } 
}