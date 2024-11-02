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

  deletePago(pag: Pago) {
    Swal.fire({
      title: "Atencion?",
      text: "Deseas dar de baja pago " + pag.id,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si"
    }).then((result) => {
      if (result.isConfirmed) {
        this._pagoService.delete(pag.id).subscribe((pag) => {
          Swal.fire({
            title: "Pago borrado",
            text: "",
            icon: "success"
          });
        }, (error) => {
          Swal.fire({
            title: "no se pudo borrar el pago",
            text: error.message,
            icon: "error"
          });
        })
      }
    });
  }

  editPago(pag: Pago) {
    this.crearEditarModePago = true;
    this.pagoSelected = pag;
  }
  new() {
    this.crearEditarModePago = true;
  }

}
