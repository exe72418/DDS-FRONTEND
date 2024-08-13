import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ClienteService } from '../services/cliente.service';
import { Cliente } from '../models/cliente';

@Component({
  selector: 'app-crear-clientes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './crear-clientes.component.html',
  styleUrl: './crear-clientes.component.css'
})
export class CrearClientesComponent implements OnInit {

  @Input() cliente! : Cliente ;

  clienteForm: FormGroup;

  constructor(private http: HttpClient, private cliService: ClienteService, private router : Router) {
    this.clienteForm = new FormGroup({
      id:new FormControl('', [Validators.required]),
      apellidoNombre: new FormControl('', [Validators.required]),
      telefono: new FormControl('', [Validators.required, ]), // Ajusta la expresión regular según tus necesidades
      cuit: new FormControl('', [Validators.required, ]), // Ajusta la expresión regular según tus necesidades
      email: new FormControl('', [Validators.required, ]),
      domicilio: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(){
      if(this.cliente){
        this.clienteForm.patchValue(this.cliente)
    }
  }

  onSubmit() {
    if (this.clienteForm.valid) {
      if(!this.cliente){
        const clienteData = this.clienteForm.value;
        // Aquí puedes enviar los datos al servidor usando HttpClient
        this.cliService.createClient(clienteData)
          .subscribe(response => {
            console.log('Cliente creado exitosamente:', response);
            // Puedes realizar acciones adicionales después de crear el cliente
          }, error => {
            console.error('Error al crear el cliente:', error);
          });
      }else{
        const clienteData = this.clienteForm.value;
        // Aquí puedes enviar los datos al servidor usando HttpClient
        this.cliService.updateClient(clienteData)
          .subscribe(response => {
            console.log('Cliente creado exitosamente:', response);
            // Puedes realizar acciones adicionales después de crear el cliente
          }, error => {
            console.error('Error al crear el cliente:', error);
          });
      }
      
    } else {
      // Manejar errores de validación
      console.error('Formulario inválido');
      console.log ( this.clienteForm)
    }
  }
}
