import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Pago } from '../../models/pago';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PagoService } from '../../services/pago.service';
import { PedidoServiceService } from '../../services/pedido-service.service';
import { TipoPago } from '../../models/tipopago';
import { Pedido } from '../../models/pedido';
import { TipopagoService } from '../../services/tipopago.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crear-pago',
  templateUrl: './crear-pago.component.html',
  styleUrls: ['./crear-pago.component.css']
})
export class CrearPagoComponent implements OnInit {
  @Input() pago!: Pago;
  @Output() editCrear: EventEmitter<boolean> = new EventEmitter();

  pagoForm!: FormGroup;
  tiposPago: TipoPago[] = [];
  pedidosSinPago: Pedido[] = [];

  constructor(private tipopagoService: TipopagoService, private pagoService: PagoService) {
    this.pagoForm = new FormGroup({
      id: new FormControl(''),
      fecha: new FormControl('', [Validators.required]),
      tipoPago: new FormControl('', [Validators.required]),
      pedido: new FormControl('', [Validators.required])
    });
  }

  ngOnInit(): void {

    if (this.pago) {

      this.pagoForm.patchValue(this.pago);


      this.tipopagoService.getTiposDePagoActivos().subscribe((data: any) => {
        this.tiposPago = data['data'].map((tipoPago: TipoPago) => {
          const tipoPagoFormateado: TipoPago = {
            id: tipoPago.id,
            nombre: tipoPago.nombre,
            descripcion: tipoPago.descripcion,
            disponible: tipoPago.disponible
          };
          return tipoPagoFormateado;
        });
      })


      this.pagoService.getPedidosSinPago().subscribe((data: any) => {
        const pedidosSinPagoNew = data['data'].map((pedido: Pedido) => ({
          nroPedido: pedido.nroPedido,
          fecha: pedido.fecha,
          total: pedido.total,
          cliente: pedido.cliente,
          entrega: pedido.entrega,
          pago: pedido.pago,
          lineas: pedido.lineas
        }));

        // Combinar pedidos de la entrega actual con los pedidos sin entrega
        this.pedidosSinPago = [this.pago.pedido, ...pedidosSinPagoNew];

        // Actualizar el control 'pedidos' en el formulario con los pedidos seleccionados
        this.pagoForm.patchValue({
          pedidosSinPago: this.pago.pedido // Seleccionar los pedidos de la entrega actual
        });
      });
    } else {
      // Obtener los repartidores
      this.tipopagoService.getTiposDePagoActivos().subscribe((data: any) => {
        this.tiposPago = data['data'].map((tipoPago: TipoPago) => {
          const tipoPagoFormateado: TipoPago = {
            id: tipoPago.id,
            nombre: tipoPago.nombre,
            descripcion: tipoPago.descripcion,
            disponible: tipoPago.disponible
          };
          return tipoPagoFormateado;
        });
      })
      // Si estamos creando una nueva entrega, solo obtener los pedidos sin entrega
      this.pagoService.getPedidosSinPago().subscribe((data: any) => {
        this.pedidosSinPago = data['data'].map((pedido: Pedido) => ({
          nroPedido: pedido.nroPedido,
          fecha: pedido.fecha,
          total: pedido.total,
          cliente: pedido.cliente,
          entrega: pedido.entrega,
          pago: pedido.pago,
          lineas: pedido.lineas
        }));
      });

    }
  }

  back() {
    this.editCrear.emit(false)
  }

  guardar(pag: Pago) {
    if (this.pago != undefined || this.pago != null) {
      if (this.pago.id) {
        this.pagoService.update(pag).subscribe(pagBackend => {
          Swal.fire({
            title: "Guardado",
            text: "Pago actualizado",
            icon: "success"
          });
          this.editCrear.emit(false);

        }, error => {
          console.error('Error al modificar el pago:', error);
        })
      }
    } else {
      pag.id = 0;
      this.pagoService.save(pag).subscribe(pagBackend => {
        Swal.fire({
          title: "Guardado",
          text: "Pago creado",
          icon: "success"
        });
        this.editCrear.emit(false);

      }, error => {
        console.error('Error al crear el pago:', error);
      });
    }
  }
}



