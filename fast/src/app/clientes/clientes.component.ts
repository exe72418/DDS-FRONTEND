import { Component, OnInit } from '@angular/core';
import { ClienteService } from '../services/cliente.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './clientes.component.html',
  styleUrl: './clientes.component.css'
})
export class ClientesComponent implements OnInit {

  constructor(private apiService: ClienteService, public router: Router) { }
  clientes: Cliente[] = [];

  ngOnInit(): void {
    this.llenarData();
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
class Cliente {
  apellidoNombre: string = "";
  id: string = "";
  telefono: string = "";
  email: string = "";
  domicilio: string = "";
  cuit: string = "";
}
