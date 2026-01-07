import { Component, OnInit } from '@angular/core';
import { CustomComponentsModule } from '../../modules/custom-components.module';
import { CrearPagoComponent } from "../crear-pago/crear-pago.component";
import { PagoService } from '../../services/pago.service';
import { Pago } from '../../models/pago';
import Swal from 'sweetalert2';
import { CargaService } from '../../services/carga.service';

@Component({
  selector: 'app-pago',
  templateUrl: './pago.component.html',
  styleUrl: './pago.component.css'
})
export class PagoComponent implements OnInit {

  pagoSelected!: Pago;
  crearEditarModePago: boolean = false;
  pagos!: Pago[];

  constructor(private _pagoService: PagoService, private cargaService: CargaService) {

  }

  ngOnInit(): void {
    this.cargaService.show();
    this.search();
  }
  search() {

    this._pagoService.getAll().subscribe((pagos) => {
      this.pagos = pagos;
      this.cargaService.hide();
    })

  }
  changeEditCreate() {
    this.crearEditarModePago = false;
  }

  deletePago(pag: Pago) {
    Swal.fire({
      title: "Atencion?",
      text: "Deseas borrar el pago " + pag.id,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, borrar!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.cargaService.show();
        this._pagoService.delete(pag.id).subscribe((pag) => {
          this.cargaService.hide();
          Swal.fire({
            title: "Pago borrado",
            text: "",
            icon: "success"
          });
        }, (error) => {
          this.cargaService.hide();
          Swal.fire({
              title: "Error",
              text: 'Error al borrar el pago',
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
