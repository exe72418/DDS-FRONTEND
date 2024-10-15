import { Component, OnInit } from '@angular/core';
import { ClienteService } from '../../services/cliente.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { Cliente } from '../../models/cliente';
import { CrearClientesComponent } from "../crear-clientes/crear-clientes.component";
import Swal from 'sweetalert2'
import { CustomComponentsModule } from '../../modules/custom-components.module';


@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrl: './clientes.component.css'
})
export class ClientesComponent implements OnInit {
  event!: boolean;


  constructor(private apiService: ClienteService, public router: Router
  ) { }

  //swal = require('sweetalert2');
  clientes!: Cliente[];
  editCreateMode: boolean = false
  clienteSelected!: Cliente;

  ngOnInit(): void {
    this.llenarData();
  }
  new() {
    this.editCreateMode = true;
  }
  changeEditCrear() {
    this.editCreateMode = false
    console.log(this.editCreateMode)
  }

  navegarEdit(cliente: Cliente) {

    this.clienteSelected = cliente;
    console.log(cliente)
    this.editCreateMode = true
  }

  borrarCliente(cliente: Cliente) {
    Swal.fire({
      title: "Atencion?",
      text: "Deseas dar de baja el cliente " + cliente.apellidoNombre,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si"
    }).then((result) => {
      if (result.isConfirmed) {
        this.apiService.deleteClient(cliente.id).subscribe((cliente) => {
          Swal.fire({
            title: "Cliente Dado de baja",
            text: "",
            icon: "success"
          });
        }, (error) => {
          Swal.fire({
            title: "no se pudo dar de baja el cliente",
            text: error.message,
            icon: "error"
          });
        })
      }
    });
  }

  llenarData() {
    this.apiService.getAllClients().subscribe(data => {
      this.clientes = data['data'].map((cliente: Cliente) => {
        const clienteFormateado: Cliente = {
          id: cliente.id,
          apellidoNombre: cliente.apellidoNombre,
          telefono: cliente.telefono,
          email: cliente.email,
          domicilio: cliente.domicilio,
          cuit: cliente.cuit,
          disponible: cliente.disponible,
          zona: cliente.zona
        };
        return clienteFormateado;
      });
      console.log(data['data'][0]);
    });
  }
}
