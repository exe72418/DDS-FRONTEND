import { TipoPago } from '../../models/tipopago';
import { Component, OnInit } from '@angular/core';
import { TipopagoService } from '../../services/tipopago.service';
import { MatTable, MatTableDataSource, MatTableModule } from '@angular/material/table';
import { DataSource } from '@angular/cdk/collections';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import Swal from 'sweetalert2';
import { CardModule } from 'primeng/card';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CrearTipoPagoComponent } from "../crear-tipopago/crear-tipopago.component";
import { CustomComponentsModule } from '../../modules/custom-components.module';

@Component({
  selector: 'app-tipopago',
  standalone: true,
  imports: [CustomComponentsModule, CrearTipoPagoComponent],
  templateUrl: './tipopago.component.html',
  styleUrl: './tipopago.component.css'
})
export class TipopagoComponent {
  crearEditarMode: boolean= false;
  tipoPagoelected!: TipoPago;
  tipoPagoForm!: FormGroup;

  constructor(private tipopagoService : TipopagoService){}
  tiposPago: TipoPago[] = [];

  ngOnInit(): void {
    this.tipoPagoForm = new FormGroup({
      id:new FormControl('', [Validators.required]),
      nombre: new FormControl('', [Validators.required]),
    })
    this.search();

  }


    search(){
      this.tipopagoService.getAll().subscribe((data:any)=>{
        this.tiposPago =data['data'].map((tipopago: TipoPago) => {
          const tipoPagoFormateado: TipoPago = {
            id: tipopago.id,
            nombre: tipopago.nombre,
            descripcion: tipopago.descripcion,
          };
          return tipoPagoFormateado;
        });
      })
    }

    changeEditCreate() {
      this.crearEditarMode = false
      this.search();
    }

    new() {
      this.crearEditarMode = true;
    }

    editProduct(tipopago: TipoPago) {
        this.crearEditarMode = true;
        this.tipoPagoelected = tipopago;

    }


  deleteTipoPago(tipoPago: TipoPago) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Deseas borrar el tipo de pago ' + tipoPago.nombre,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, borrarlo'
    }).then((result) => {
      if (result.isConfirmed) {
        this.tipopagoService.delete(tipoPago.id).subscribe(() => {
          Swal.fire(
            'Eliminado',
            'El tipo de pago ha sido eliminado.',
            'success'
          );
          this.search(); // Recargar la lista de tipos de pago
        }, (error) => {
          Swal.fire(
            'Error al eliminar',
            error.message,
            'error'
          );
        });
      }
    });
  }




  }






