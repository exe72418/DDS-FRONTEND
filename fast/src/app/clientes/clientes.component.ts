import { Component, OnInit } from '@angular/core';
import { ClienteService } from '../services/cliente.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import { Cliente } from '../models/cliente';
import { CrearClientesComponent } from "../crear-clientes/crear-clientes.component";
import Swal from 'sweetalert2'


@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, MatIconModule, CrearClientesComponent],
  templateUrl: './clientes.component.html',
  styleUrl: './clientes.component.css'
})
export class ClientesComponent implements OnInit {

  constructor(private apiService: ClienteService, public router: Router
  ) { }

  //swal = require('sweetalert2');
  clientes!:Cliente [];
  editCreateMode:boolean = false
  clienteSelected! : Cliente;

  ngOnInit(): void {
    this.llenarData();
  }

  navegarEdit(cliente:Cliente){
    
    this.clienteSelected = cliente;
    console.log(cliente)
    this.editCreateMode = true
  }

  borrarCliente(cliente:Cliente){
    Swal.fire({
      title: "Atencion?",
      text: "Deseas borrar el cliente " + cliente.apellidoNombre,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si"
    }).then((result) => {
      if (result.isConfirmed) {
        this.apiService.deleteClient(cliente.id).subscribe((cliente)=>{
          Swal.fire({
            title: "Cliente borrado",
            text: "",
            icon: "success"
          });
        },(error)=>{
          Swal.fire({
            title: "Cliente no se borro",
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
          disponible:cliente.disponible
        };
        return clienteFormateado;
      });
      console.log(data['data'][0]);
    });
  }
}
