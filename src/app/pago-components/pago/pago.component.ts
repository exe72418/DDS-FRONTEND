import { Component, OnInit } from '@angular/core';
import { CustomComponentsModule } from '../../modules/custom-components.module';
import { CrearPagoComponent } from "../crear-pago/crear-pago.component";
import { PagoService } from '../../services/pago.service';
import { Pago } from '../../models/pago';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-pago',
  templateUrl: './pago.component.html',
  styleUrl: './pago.component.css'
})
export class PagoComponent implements OnInit {

  pagoSelected!: Pago;
  crearEditarModePago: boolean = false;
  pagos!: Pago[];

  constructor(private _pagoService: PagoService) {

  }

  ngOnInit(): void {
    this.search();
  }
  search() {
    this._pagoService.getAll().subscribe((pagos) => {
      console.log(pagos)
      this.pagos = pagos;
    })
  }
  changeEditCreate() {
    this.crearEditarModePago = false;
  }

  deletePago(_t17: any) {
    throw new Error('Method not implemented.');
  }

  editPago(pag: Pago) {
    this.crearEditarModePago = true;
    this.pagoSelected = pag;
  }
  new() {
    this.crearEditarModePago = true;
  }

}
