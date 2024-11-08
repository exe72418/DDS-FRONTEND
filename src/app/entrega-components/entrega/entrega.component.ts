import { Component, OnInit } from '@angular/core';
import { CustomComponentsModule } from '../../modules/custom-components.module';
import { CrearEntregaComponent } from "../crear-entrega/crear-entrega.component";
import { EntregaService } from '../../services/entrega.service';
import { Entrega } from '../../models/entrega';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-entrega',
  templateUrl: './entrega.component.html',
  styleUrl: './entrega.component.css'
})
export class EntregaComponent implements OnInit {

  entSelected!: Entrega;
  crearEditarModeEntrega: boolean = false;
  entregas!: Entrega[];

  constructor(private _entregaService: EntregaService) {

  }

  ngOnInit(): void {
    this.search();
  }
  search() {
    this._entregaService.getAll().subscribe((entregas) => {
      this.entregas = entregas;
    })
  }
  changeEditCreate() {
    this.crearEditarModeEntrega = false;
  }

  deleteEntrega(ent: Entrega) {
    Swal.fire({
      title: "Atencion?",
      text: "Deseas dar de baja entrega " + ent.id,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si"
    }).then((result) => {
      if (result.isConfirmed) {
        this._entregaService.delete(ent.id).subscribe((ent) => {
          Swal.fire({
            title: "Entrega borrada",
            text: "",
            icon: "success"
          });
        }, (error) => {
          Swal.fire({
            title: "no se pudo borrar la entrega",
            text: error.message,
            icon: "error"
          });
        })
      }
    });
  }

  editEntrega(ent: Entrega) {
    this.crearEditarModeEntrega = true;
    this.entSelected = ent;
  }
  new() {
    this.crearEditarModeEntrega = true;
  }

}
