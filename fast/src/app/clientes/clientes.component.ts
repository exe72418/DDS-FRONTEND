import { Component, OnInit } from '@angular/core';
import { ClienteService } from '../services/cliente.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import { Cliente } from '../models/cliente';
import { CrearClientesComponent } from "../crear-clientes/crear-clientes.component";
import Swal, { SweetAlertResult } from 'sweetalert2'


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

  borrarCliente(id:number){
    
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
        };
        return clienteFormateado;
      });
      console.log(data['data'][0]);
    });
  }
}
