import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthservicesService } from '../services/authservices.service';
import { Router } from '@angular/router';
import { CargaService } from '../services/carga.service';
import { MatDialogRef } from '@angular/material/dialog';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {


  loginForm: FormGroup;
  register: boolean = false;
  isAutenticated: boolean = false;

  constructor(private authService: AuthservicesService, private cargaService: CargaService, 
    private router: Router,  public dialogRef: MatDialogRef<LoginComponent>,
  ) {
    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required]),  // Usuario es obligatorio
      password: new FormControl('', [Validators.required]),  // Contraseña es obligatoria
    });
  }
  ngOnInit(): void {
    this.isAutenticated = this.authService.isAuthenticated()
  }

  cambiarRegister() {
    this.register = !this.register;
  }

  logout() {
    this.authService.logout();
    this.isAutenticated = false;
  }

  onSubmit(accion: string) {
    if(accion === 'inicio'){
      this.cargaService.show();
      if (this.loginForm.valid) {
        const { username, password } = this.loginForm.value;
        this.authService.login(username, password).subscribe(
          (response) => {
            this.cargaService.hide();
            console.log('Token JWT recibido:', response.token);
            localStorage.setItem('auth_token', response.token); 
            this.isAutenticated = true;
            this.dialogRef.close()
            Swal.fire({
              title: "Usuario autenticado",
              text: "",
              icon: "success"
            });
            this.router.navigate(['home'])
          },
          (error) => {
            this.cargaService.hide();
            Swal.fire({
              title: "Error",
              text: "No fue posible loguearse",
              icon: "error"
            });
            console.error('Error de autenticación:', error);
          }
        );
      }
    }else if(accion==='registrar'){
      if (this.loginForm.valid) {
        const { username, password } = this.loginForm.value;
        this.authService.register(username, password).subscribe(
          (response) => {
            console.log('usuario regsitrado', response);
            this.isAutenticated = true;
            Swal.fire({
              title: "Usuario autenticado",
              text: "",
              icon: "success"
            });
            this.dialogRef.close()
            
          },
          (error) => {
            Swal.fire({
              title: "Error",
              text: "No fue posible registrarse",
              icon: "error"
            });
            console.error('Error de autenticación:', error);
          }
        );
      }
    }
    
  }

    
}

