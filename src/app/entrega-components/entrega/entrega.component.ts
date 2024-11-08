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

  deleteEntrega(_t17: any) {
    throw new Error('Method not implemented.');
  }

  editEntrega(ent: Entrega) {
    this.crearEditarModeEntrega = true;
    this.entSelected = ent;
  }
  new() {
    this.crearEditarModeEntrega = true;
  }

}
