import { Component, OnInit } from '@angular/core';
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

  pagoSelected: Pago | null = null;
  crearEditarModePago: boolean = false;
  pagos: Pago[] = [];
  pedidoHijo: number | null = null;

  constructor(private _pagoService: PagoService, 
    private cargaService: CargaService) {}

  ngOnInit(): void {
    this.cargaService.show();
    this.search();
    if (this._pagoService.pedidoPendienteId) {

        this.pedidoHijo = this._pagoService.pedidoPendienteId;
        
        this.crearEditarModePago = true; 

        this._pagoService.pedidoPendienteId = null;
    }
  }

  search() {
    this._pagoService.getAll().subscribe((response: any) => {
      this.pagos = response.data || response.pagos || response;
      this.cargaService.hide();
    });
  }

  changeEditCreate() {
    this.crearEditarModePago = false;
    this.pagoSelected = null;
    this.search();
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
        this._pagoService.delete(pag.id).subscribe(() => {
          this.cargaService.hide();
          Swal.fire({
            title: "Pago borrado",
            text: "",
            icon: "success"
          });
          this.search();
        }, () => {
          this.cargaService.hide();
          Swal.fire({
            title: "Error",
            text: "Error al borrar el pago",
            icon: "error"
          });
        });
      }
    });
  }

  editPago(pag: Pago) {
    this.pagoSelected = pag;
    this.crearEditarModePago = true;
  }

  new() {
    this.pagoSelected = null;
    this.crearEditarModePago = true;
  }
}