import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ClienteService } from '../../services/cliente.service';
import { Cliente } from '../../models/cliente';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crear-clientes',
  templateUrl: './crear-clientes.component.html',
  styleUrl: './crear-clientes.component.css'
})
export class CrearClientesComponent implements OnInit {

  @Input() cliente! : Cliente ;
  @Output() editCrear: EventEmitter<boolean> = new EventEmitter();


  clienteForm: FormGroup;

  constructor(private http: HttpClient, private cliService: ClienteService, private router : Router) {
    this.clienteForm = new FormGroup({
      id:new FormControl(''),
      apellidoNombre: new FormControl('', [Validators.required]),
      telefono: new FormControl('', [Validators.required, ]), // Ajusta la expresión regular según tus necesidades
      cuit: new FormControl('', [Validators.required, ]), // Ajusta la expresión regular según tus necesidades
      email: new FormControl('', [Validators.required, ]),
      domicilio: new FormControl('', [Validators.required]),
      zona: new FormControl('',[Validators.required]),
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
        let clienteData = this.clienteForm.value;
        clienteData.id = 0;
        // Aquí puedes enviar los datos al servidor usando HttpClient
        this.cliService.createClient(clienteData)
          .subscribe(response => {
            Swal.fire({
              title: "Guardado",
              text: "Cliente creado",
              icon: "success"
            });
            this.editCrear.emit(false);

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
            Swal.fire({
              title: "Guardado",
              text: "Cliente actualizado",
              icon: "success"
            });
            this.editCrear.emit(false);

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
