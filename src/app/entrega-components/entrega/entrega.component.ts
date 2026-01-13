import { Component, OnInit } from '@angular/core';
import { EntregaService } from '../../services/entrega.service';
import { Entrega } from '../../models/entrega';
import Swal from 'sweetalert2';
import { CargaService } from '../../services/carga.service';

@Component({
  selector: 'app-entrega',
  templateUrl: './entrega.component.html',
  styleUrl: './entrega.component.css'
})
export class EntregaComponent implements OnInit {

  entSelected: Entrega | null = null;
  crearEditarModeEntrega: boolean = false;
  entregas: Entrega[] = [];

  constructor(private _entregaService: EntregaService, private cargaService: CargaService) {}

  ngOnInit(): void {
    this.search();
  }

  search() {
    this.cargaService.show();
    this._entregaService.getAll().subscribe({
      next: (response: any) => {
        if (response) {
          this.entregas = response.data || response.entregas || response;
        } else {
          this.entregas = [];
        }
        this.cargaService.hide();
      },
      error: (error) => {
        console.error('Error HTTP:', error);
        this.cargaService.hide();
      }
    });
  }

  changeEditCreate() {
    this.crearEditarModeEntrega = false;
    this.entSelected = null;
    this.search();
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
          this.search();
        }, (error) => {
          this.cargaService.hide();
          Swal.fire({
            title: "No se pudo borrar la entrega",
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
