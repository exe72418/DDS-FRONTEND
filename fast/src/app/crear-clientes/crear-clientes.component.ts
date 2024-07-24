import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ClienteService } from '../services/cliente.service';

@Component({
  selector: 'app-crear-clientes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './crear-clientes.component.html',
  styleUrl: './crear-clientes.component.css'
})
export class CrearClientesComponent {
  clienteForm: FormGroup;

  constructor(private http: HttpClient, private cliService: ClienteService) {
    this.clienteForm = new FormGroup({
      apellidoNombre: new FormControl('', [Validators.required]),
      telefono: new FormControl('', [Validators.required, Validators.pattern('[0-9]{10}')]), // Ajusta la expresión regular según tus necesidades
      cuit: new FormControl('', [Validators.required, Validators.pattern('[0-9]{11}')]), // Ajusta la expresión regular según tus necesidades
      email: new FormControl('', [Validators.required, Validators.email]),
      domicilio: new FormControl('', [Validators.required]),
    });
  }

  onSubmit() {
    if (this.clienteForm.valid) {
      const clienteData = this.clienteForm.value;
      // Aquí puedes enviar los datos al servidor usando HttpClient
      this.cliService.createClient(clienteData)
        .subscribe(response => {
          console.log('Cliente creado exitosamente:', response);
          // Puedes realizar acciones adicionales después de crear el cliente
        }, error => {
          console.error('Error al crear el cliente:', error);
        });
    } else {
      // Manejar errores de validación
      console.error('Formulario inválido');
    }
  }
}
