import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthservicesService } from '../services/authservices.service';
import { Router } from '@angular/router';
import { CargaService } from '../services/carga.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent {

  loginForm: FormGroup;
  register: boolean = true;

  constructor(private authService: AuthservicesService, private cargaService: CargaService, private router: Router) {
    // Definimos el formulario con dos campos: usuario y contraseña
    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required]),  // Usuario es obligatorio
      password: new FormControl('', [Validators.required]),  // Contraseña es obligatoria
    });
  }

  cambiarRegister() {
    this.register = !this.register;
  }

  onSubmit() {
    this.cargaService.show();
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      this.authService.login(username, password).subscribe(
        (response) => {
          this.cargaService.hide();
          console.log('Token JWT recibido:', response.token);
          localStorage.setItem('token', response.token); // Guardar el token en el localStorage
          this.router.navigate(['home'])
        },
        (error) => {
          this.cargaService.hide();
          console.error('Error de autenticación:', error);
        }
      );
    }
  }

  registerSubmit() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      this.authService.register(username, password).subscribe(
        (response) => {
          console.log('usuario regsitrado', response);
        },
        (error) => {
          console.error('Error de autenticación:', error);
        }
      );
    }
  }
}

