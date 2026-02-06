import { Component, OnInit } from '@angular/core';
import { EntregaService } from '../../services/entrega.service';
import { Entrega } from '../../models/entrega';
import Swal from 'sweetalert2';
import { CargaService } from '../../services/carga.service';
import { ClienteService } from '../../services/cliente.service';
import { Cliente } from '../../models/cliente';
import { AuthservicesService } from '../../services/authservices.service';

@Component({
  selector: 'app-entrega',
  templateUrl: './entrega.component.html',
  styleUrl: './entrega.component.css'
})
export class EntregaComponent implements OnInit {

  entSelected: Entrega | null = null;
  crearEditarModeEntrega: boolean = false;
  
  entregas: Entrega[] = []; 
  clientes: Cliente[] = [];

  fechaDesde: Date | null = null;
  fechaHasta: Date | null = null;
  clienteSelect: Cliente | null = null;

  constructor(
    private _entregaService: EntregaService, 
    private cargaService: CargaService,
    private clienteService: ClienteService,
    private authService: AuthservicesService
  ) {}

  ngOnInit(): void {
    this.cargaService.show();
    if (this.isAdmin()) {
        this.cargarClientes();
    }
    this.buscar(); 
  }

  isAdmin(): boolean {
    return this.authService.getUserData()?.role === 'admin';
  }

  cargarClientes() {
    this.clienteService.getAll().subscribe({
      next: (res: any) => {
        this.clientes = res.data || res.clientes || res;
      },
      error: (err) => console.error(err)
    });
  }

buscar() {
    if (this.isAdmin()) {
        const clienteId = this.clienteSelect ? this.clienteSelect.id : null;
        
        this._entregaService
          .getEntregasByFilters(this.fechaDesde, this.fechaHasta, clienteId)
          .subscribe({
            next: (entregasFiltradas) => {
              this.entregas = entregasFiltradas;
              this.cargaService.hide();
            },
            error: (err) => {
              console.error(err);
              this.cargaService.hide();
              Swal.fire({ title: "Error", text: "No se pudieron cargar las entregas", icon: "error" });
            }
          });

    } else {
        this._entregaService.misEntregas().subscribe({
            next: (misEntregas) => {
                this.entregas = misEntregas;
                this.cargaService.hide();
            },
            error: (err) => {
                console.error(err);
                this.cargaService.hide();
                Swal.fire({ title: "Error", text: "No se pudieron cargar tus entregas", icon: "error" });
            }
        });
    }
  }

  changeEditCreate() {
    this.crearEditarModeEntrega = false;
    this.entSelected = null;
    this.buscar(); 
  }

  deleteEntrega(ent: Entrega) {
    Swal.fire({
      title: "Atención",
      text: "Deseas eliminar la entrega " + ent.id,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí"
    }).then((result) => {
      if (result.isConfirmed) {
        this.cargaService.show();
        this._entregaService.delete(ent.id!).subscribe(() => {
          this.cargaService.hide();
          Swal.fire({
            title: "Entrega borrada",
            text: "",
            icon: "success"
          });
          this.buscar(); 
        }, (error) => {
          this.cargaService.hide();
          Swal.fire({
            title: "No se pudo borrar",
            text: error.error.message || error.message,
            icon: "error"
          });
        });
      }
    });
  }

  editEntrega(ent: Entrega) {
    this.entSelected = ent;
    this.crearEditarModeEntrega = true;
  }

  new() {
    this.entSelected = null;
    this.crearEditarModeEntrega = true;
  }
}