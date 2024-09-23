import { Component, OnInit } from '@angular/core';
import { CustomComponentsModule } from '../../modules/custom-components.module';
import { CrearEntregaComponent } from "../crear-entrega/crear-entrega.component";
import { EntregaService } from '../../services/entrega.service';
import { Entrega } from '../../models/entrega';


@Component({
  selector: 'app-entrega',
  standalone: true,
  imports: [CustomComponentsModule, CrearEntregaComponent],
  templateUrl: './entrega.component.html',
  styleUrl: './entrega.component.css'
})
export class EntregaComponent {

  entSelected!: Entrega;
  crearEditarMode: boolean = false;
  entregas!: Entrega[];

  constructor(private _entregaService: EntregaService) {

  }
  ngOnInit(): void {
    this._entregaService.getAll().subscribe((entregas) => {
      console.log(entregas)
      this.entregas = entregas;
    })
  }
  changeEditCreate() {
    this.crearEditarMode = false;
  }

  deleteEntrega(_t17: any) {
    throw new Error('Method not implemented.');
  }
  editEntrega(ent: Entrega) {
    this.crearEditarMode = true;
    this.entSelected = ent;
  }
  new() {
    this.crearEditarMode = true;
  }

}
