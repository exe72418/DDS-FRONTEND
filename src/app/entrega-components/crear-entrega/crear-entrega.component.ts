import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Entrega } from '../../models/entrega';
import { Pedido } from '../../models/pedido';
import { CustomComponentsModule } from '../../modules/custom-components.module';
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
export class CrearEntregaComponent {

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

    })
  }
  ngOnInit(): void {
    if (this.entrega) {
      // Carga los datos de la entrega existente en el formulario
      this.entregaForm.patchValue(this.entrega);

      // Al editar, incluir los pedidos de la entrega actual
      this.pedidos = [...this.entrega.pedidos]; // Inicialmente cargamos los pedidos de la entrega

      // Obtener los repartidores
      this.repartidorService.getRepartidoresActivos().subscribe((data: any) => {
        this.repartidores = data['data'].map((repartidor: Repartidor) => {
          return {
            id: repartidor.id,
            cuit: repartidor.cuit,
            apellidoNombre: repartidor.apellidoNombre,
            vehiculo: repartidor.vehiculo,
            zona: repartidor.zona
          };
        });
      });

      // Obtener los pedidos sin entrega
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

        // Combinar pedidos de la entrega actual con los pedidos sin entrega
        this.pedidos = [...pedidosSinEntrega, ...this.entrega.pedidos];

        // Actualizar el control 'pedidos' en el formulario con los pedidos seleccionados
        this.entregaForm.patchValue({
          pedidos: this.entrega.pedidos // Seleccionar los pedidos de la entrega actual
        });
      });
    } else {

      // Obtener los repartidores
      this.repartidorService.getRepartidoresActivos().subscribe((data: any) => {
        this.repartidores = data['data'].map((repartidor: Repartidor) => {
          return {
            id: repartidor.id,
            cuit: repartidor.cuit,
            apellidoNombre: repartidor.apellidoNombre,
            vehiculo: repartidor.vehiculo,
            zona: repartidor.zona
          };
        });
      });
      // Si estamos creando una nueva entrega, solo obtener los pedidos sin entrega
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
        })
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
