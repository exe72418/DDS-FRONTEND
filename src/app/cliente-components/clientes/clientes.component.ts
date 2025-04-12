import { Cliente } from '../../models/cliente';
import { Component, OnInit } from '@angular/core';
import { ClienteService } from '../../services/cliente.service';
import { MatTable, MatTableDataSource, MatTableModule } from '@angular/material/table';
import { DataSource } from '@angular/cdk/collections';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import Swal from 'sweetalert2';
import { CardModule } from 'primeng/card';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CrearClientesComponent } from "../crear-clientes/crear-clientes.component";
import { CustomComponentsModule } from '../../modules/custom-components.module';
import { CargaService } from '../../services/carga.service';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrl: './clientes.component.css'
})
export class ClientesComponent {
  crearEditarMode: boolean = false;
  clienteSelected!: Cliente;
  clienteForm!: FormGroup;

  constructor(private clienteService: ClienteService, private cargaService: CargaService) { }
  clientes!: Cliente[];

  ngOnInit(): void {
    this.clienteForm = new FormGroup({
      id: new FormControl('', [Validators.required]),
      apellidoNombre: new FormControl('', [Validators.required]),
      telefono: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      domicilio: new FormControl('', [Validators.required]),
      cuit: new FormControl('', [Validators.required]),
      disponible: new FormControl('', [Validators.required]),
      zona: new FormControl('', [Validators.required])
    })
    this.search();

  }


  search() {
    this.cargaService.show();
    this.clienteService.getAll().subscribe((data: any) => {
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
      this.cargaService.hide();
    })
  }

  changeEditCreate() {
    this.crearEditarMode = false
    this.search();
  }

  new() {
    this.crearEditarMode = true;
  }

  editCliente(cliente: Cliente) {
    this.crearEditarMode = true;
    this.clienteSelected = cliente;

  }


  deleteCliente(cliente: Cliente) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Deseas borrar el cliente ' + cliente.apellidoNombre,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, borrarlo'
    }).then((result) => {
      if (result.isConfirmed) {
        this.cargaService.show();
        this.clienteService.delete(cliente.id).subscribe(() => {
          this.cargaService.hide();
          Swal.fire(
            'Eliminado',
            'El cliente ha sido eliminado.',
            'success'
          );
          this.search();
        }, (error) => {
          this.cargaService.hide();
          Swal.fire(
            'Error al eliminar',
            error.message,
            'error'
          );
        });
      }
    });
  }
}
