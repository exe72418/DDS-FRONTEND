import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ClienteService } from '../../services/cliente.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Cliente } from '../../models/cliente';
import Swal from 'sweetalert2';
import { CustomComponentsModule } from '../../modules/custom-components.module';

@Component({
  selector: 'app-crear-clientes',
  templateUrl: './crear-clientes.component.html',
  styleUrl: './crear-clientes.component.css'
})
export class CrearClientesComponent implements OnInit {

  @Input() cliente!: Cliente;
  @Output() editCrear: EventEmitter<boolean> = new EventEmitter();
  clienteForm: FormGroup;


  constructor(private clienteService: ClienteService) {
    this.clienteForm = new FormGroup({
      id: new FormControl(''),
      apellidoNombre: new FormControl('', [Validators.required]),
      telefono: new FormControl('', [Validators.required,]), // Ajusta la expresión regular según tus necesidades
      cuit: new FormControl('', [Validators.required,]), // Ajusta la expresión regular según tus necesidades
      email: new FormControl('', [Validators.required,]),
      domicilio: new FormControl('', [Validators.required]),
      zona: new FormControl('', [Validators.required])
    });
  }

  ngOnInit() {
    if (this.cliente) {
      this.clienteForm.patchValue(this.cliente)
    }
  }

  back() {
    this.editCrear.emit(false)
  }

  guardar(cliente: Cliente) {
    if (this.clienteForm.valid) {

      if (!this.cliente) {
        cliente.id = 0;

        this.clienteService.create(cliente)
          .subscribe(response => {
            Swal.fire({
              title: "Guardado",
              text: 'Cliente creado',
              icon: "success"
            });

            this.editCrear.emit(false);
          }, error => {

            console.error('Error al crear el cliente:', error);
            Swal.fire({
              title: "Error",
              text: 'Error al crear el cliente',
              icon: "error"
            });
          });

      } else {

        this.clienteService.update(cliente)
          .subscribe(response => {
            Swal.fire({
              title: "Guardado",
              text: 'Cliente actualizado',
              icon: "success"
            });

            this.editCrear.emit(false);
          }, error => {
            // Manejo de errores
            console.error('Error al modificar el cliente:', error);
            Swal.fire({
              title: "Error",
              text: 'Error al modificar el cliente',
              icon: "error"
            });
          });
      }

    } else {

      Swal.fire({
        title: "Error",
        text: 'Formulario inválido. Verifique los datos ingresados.',
        icon: "error"
      });
      console.error('Formulario inválido');
    }
  }
}
