import { TipoPago } from '../../models/tipopago';
import { Component, OnInit } from '@angular/core';
import { TipopagoService } from '../../services/tipopago.service';
import Swal from 'sweetalert2';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CargaService } from '../../services/carga.service';

@Component({
  selector: 'app-tipopago',
  templateUrl: './tipopago.component.html',
  styleUrl: './tipopago.component.css'
})
export class TipopagoComponent implements OnInit {
  crearEditarMode: boolean = false;
  tipoPagoelected: TipoPago | null = null;
  tipoPagoForm!: FormGroup;

  tiposPago: TipoPago[] = [];

  constructor(private tipopagoService: TipopagoService, private cargaService: CargaService) {}

  ngOnInit(): void {
    this.tipoPagoForm = new FormGroup({
      id: new FormControl('', [Validators.required]),
      nombre: new FormControl('', [Validators.required]),
    });
    this.search();
  }

  search() {
    this.cargaService.show();
    this.tipopagoService.getAll().subscribe((data: any) => {
      this.tiposPago = data['data'].map((tipopago: TipoPago) => {
        const tipoPagoFormateado: TipoPago = {
          id: tipopago.id,
          nombre: tipopago.nombre,
          descripcion: tipopago.descripcion,
          disponible: tipopago.disponible
        };
        return tipoPagoFormateado;
      });
      this.cargaService.hide();
    });
  }

  changeEditCreate() {
    this.crearEditarMode = false;
    this.tipoPagoelected = null;
    this.search();
  }

  new() {
    this.tipoPagoelected = null;
    this.crearEditarMode = true;
  }

  editTipoPago(tipopago: TipoPago) {
    this.tipoPagoelected = tipopago;
    this.crearEditarMode = true;
  }

  deleteTipoPago(tipoPago: TipoPago) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Deseas dar de baja el tipo de pago ' + tipoPago.nombre,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, dar de baja!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.cargaService.show();
        this.tipopagoService.delete(tipoPago.id).subscribe(() => {
          this.cargaService.hide();
          Swal.fire(
            'Eliminado',
            'El tipo de pago ha sido dado de baja.',
            'success'
          );
          this.search();
        }, () => {
          this.cargaService.hide();
          Swal.fire({
            title: "Error",
            text: 'Error al dar de baja el tipo de pago',
            icon: "error"
          });
        });
      }
    });
  }
}
