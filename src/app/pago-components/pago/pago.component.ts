import { Component, OnInit } from '@angular/core';
import { PagoService } from '../../services/pago.service';
import { Pago } from '../../models/pago';
import Swal from 'sweetalert2';
import { CargaService } from '../../services/carga.service';
import { AuthservicesService } from '../../services/authservices.service'; // <--- 1. Importar AuthService

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

  constructor(
    private _pagoService: PagoService, 
    private cargaService: CargaService,
    private authService: AuthservicesService 
  ) {}

  ngOnInit(): void {
    this.cargaService.show();
    this.search();

    if (this._pagoService.pedidoPendienteId) {
        this.pedidoHijo = this._pagoService.pedidoPendienteId;
        this.crearEditarModePago = true; 
        this._pagoService.pedidoPendienteId = null;
    }
  }

  isAdmin(): boolean {
    return this.authService.getUserData()?.role === 'admin';
  }

  search() {
    let observablePagos;

    if (this.isAdmin()) {
        observablePagos = this._pagoService.getAll();
    } else {
        observablePagos = this._pagoService.misPagos(); 
    }

    observablePagos.subscribe({
      next: (response: any) => {
        this.pagos = response.data || response.pagos || response;
        this.cargaService.hide(); 
      },
      error: (error: any) => {
        console.error('Error al cargar pagos:', error);
        this.cargaService.hide();
        Swal.fire({
            title: "Error",
            text: "No se pudieron cargar los pagos.",
            icon: "error"
        });
      }
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
        
        this._pagoService.delete(pag.id).subscribe({
            next: () => {
                this.cargaService.hide();
                Swal.fire({
                    title: "Pago borrado",
                    text: "",
                    icon: "success"
                });
                this.search();
            }, 
            error: () => {
                this.cargaService.hide(); 
                Swal.fire({
                    title: "Error",
                    text: "Error al borrar el pago",
                    icon: "error"
                });
            }
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