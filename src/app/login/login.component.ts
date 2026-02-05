import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthservicesService } from '../services/authservices.service';
import { Router } from '@angular/router';
import { CargaService } from '../services/carga.service';
import { MatDialogRef } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { Zona } from '../models/zona'; 
import { ZonaService } from '../services/zona.service'; 

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
    zona: new FormControl('', Validators.required) 
  });

  isRegister = false;
  isAutenticated!: boolean;
  zonas: Zona[] = []; 

  constructor(
    private authService: AuthservicesService, 
    private cargaService: CargaService, 
    private router: Router,  
    public dialogRef: MatDialogRef<LoginComponent>,
    private zonaService: ZonaService 
  ) {
    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.isAutenticated = this.authService.isAuthenticated();

    this.zonaService.getZonasActivas().subscribe((response: any) => {
        this.zonas = response.data || response;
    });
  }

  cambiarRegister() {
    this.isRegister = !this.isRegister;
  }

  logout() {
    this.authService.logout();
    this.isAutenticated = false;
    this.router.navigate(['home'])
  }

  isAdmin(): boolean {
    return this.authService.getUserData()?.role === 'admin';
  } 
  
  isCliente(){
    return this.authService.getUserData()?.role === 'cliente';
  }

  login() {
    const { username, password } = this.loginForm.value;

    this.authService.login(username!, password!).subscribe(res => {
      localStorage.setItem('auth_token', res.token);
      this.isAutenticated = true;
      this.dialogRef.close() 
      Swal.fire({ title: "Usuario autenticado", text: "", icon: "success" }); 
      this.router.navigate(['home'])
      }, 
      (error) => { 
        this.cargaService.hide(); Swal.fire({ title: "Error", text: "No fue posible loguearse", icon: "error" 
      });
    });
  }

  register() {
    if (this.registerForm.invalid) {
        Swal.fire({ title: "Error", text: "Complete todos los campos", icon: "warning" });
        return;
    }
    
    this.authService.register(this.registerForm.value).subscribe(() => {
      const { username, password } = this.registerForm.value;
      this.authService.login(username!, password!).subscribe(res => {
        localStorage.setItem('auth_token', res.token);
        this.isAutenticated = true;
        this.dialogRef.close();
        Swal.fire({ title: "Usuario autenticado", text: "", icon: "success" }); 
        this.router.navigate(['home']);
        }, 
        (error) => { 
          this.cargaService.hide(); Swal.fire({ title: "Error", text: "No fue posible loguearse", icon: "error" 
        });
      });
    });
  } 
}