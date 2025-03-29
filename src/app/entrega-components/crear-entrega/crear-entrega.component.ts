import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Entrega } from '../../models/entrega';
import { Pedido } from '../../models/pedido';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { RepartidorService } from '../../services/repartidor.service';
import { Repartidor } from '../../models/repartidor';
import { EntregaService } from '../../services/entrega.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crear-entrega',
  templateUrl: './crear-entrega.component.html',
  styleUrl: './crear-entrega.component.css'
})
export class CrearEntregaComponent implements OnInit {
  @Input() entrega!: Entrega;
  @Output() editCrear: EventEmitter<boolean> = new EventEmitter();

  entregaForm!: FormGroup;
  repartidores: Repartidor[] = [];
  pedidos: Pedido[] = [];

  constructor(private repartidorService: RepartidorService, private _entregaService: EntregaService) {
    this.entregaForm = new FormGroup({
      id: new FormControl(''),
      fecha: new FormControl('', [Validators.required]),
      lote: new FormControl('', [Validators.required]),
      zona: new FormControl('', [Validators.required]),
      repartidor: new FormControl('', [Validators.required]),
      pedidos: new FormControl([])
    });
  }

  ngOnInit(): void {
    if (this.entrega) {
      this.entrega.fecha = new Date(this.entrega.fecha); // Asegurar que la fecha sea un objeto Date

      this.entregaForm.patchValue({
        ...this.entrega,
        fecha: this.entrega.fecha,
      });

      console.log("Datos de la entrega recibidos:", this.entrega);

      this.pedidos = [...this.entrega.pedidos];

      this.repartidorService.getRepartidoresActivos().subscribe((data: any) => {
        this.repartidores = data['data'].map((repartidor: Repartidor) => ({
          id: repartidor.id,
          cuit: repartidor.cuit,
          apellidoNombre: repartidor.apellidoNombre,
          vehiculo: repartidor.vehiculo,
          zona: repartidor.zona
        }));
      });

      this._entregaService.getPedidosPagosSinEntrega().subscribe((data: any) => {
        const pedidosSinEntrega = data['data'].map((pedido: Pedido) => ({
          nroPedido: pedido.nroPedido,
          fecha: pedido.fecha,
          total: pedido.total,
          cliente: pedido.cliente,
          entrega: pedido.entrega,
          pago: pedido.pago,
          lineas: pedido.lineas
        }));

        this.pedidos = [...pedidosSinEntrega, ...this.entrega.pedidos];

        this.entregaForm.patchValue({
          pedidos: this.entrega.pedidos
        });
      });
    } else {
      this.repartidorService.getRepartidoresActivos().subscribe((data: any) => {
        this.repartidores = data['data'].map((repartidor: Repartidor) => ({
          id: repartidor.id,
          cuit: repartidor.cuit,
          apellidoNombre: repartidor.apellidoNombre,
          vehiculo: repartidor.vehiculo,
          zona: repartidor.zona
        }));
      });

      this._entregaService.getPedidosPagosSinEntrega().subscribe((data: any) => {
        this.pedidos = data['data'].map((pedido: Pedido) => ({
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
    this.editCrear.emit(false);
  }

  guardar(ent: Entrega) {
    if (this.entrega != undefined || this.entrega != null) {
      if (this.entrega.id) {
        this._entregaService.update(ent).subscribe(entBackend => {
          Swal.fire({
            title: "Guardado",
            text: "Entrega actualizada",
            icon: "success"
          });
          this.editCrear.emit(false);
        }, error => {
          console.error('Error al modificar la entrega:', error);
        });
      }
    } else {
      ent.id = 0;
      this._entregaService.save(ent).subscribe(entBackend => {
        Swal.fire({
          title: "Guardado",
          text: "Entrega creada",
          icon: "success"
        });
        this.editCrear.emit(false);
      }, error => {
        console.error('Error al crear la entrega:', error);
      });
    }
  }
}