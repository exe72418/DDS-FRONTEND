import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Pedido } from '../models/pedido';
import { ClienteService } from '../services/cliente.service';
import { Cliente } from '../models/cliente';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PagoService } from '../services/pago.service';
import { Pago } from '../models/pago';
import { PedidoServiceService } from '../services/pedido-service.service';
import Swal from 'sweetalert2';
import { LineaDeProducto } from '../models/lineaProducto';

@Component({
  selector: 'app-crear-pedido',
  templateUrl: './crear-pedido.component.html',
  styleUrl: './crear-pedido.component.css'
})
export class CrearPedidoComponent implements OnInit {



  @Input() pedido!: Pedido;
  @Output() editCrear: EventEmitter<boolean> = new EventEmitter();

  clientes!: Cliente[];
  clienteSelected!: Cliente;
  fechaSelected!: Date;
  pagoSelected!: boolean;
  entregaSelected!: boolean;
  pedidoForm!: FormGroup;
  pagos!: Pago[];
  lineasSelected: LineaDeProducto[] = [];

  constructor(private _clienteService: ClienteService, private _pagoService: PagoService,
    private _pedidoService: PedidoServiceService
  ) {

  }
  ngOnInit(): void {

    this.pedidoForm = new FormGroup({
      nroPedido: new FormControl(''),
      cliente: new FormControl('', [Validators.required]),
      lineas: new FormControl('', [Validators.required]),
      fecha: new FormControl(''),
      total: new FormControl(''),
      entrega: new FormControl(''),
      pago: new FormControl('')

    })
    if (this.pedido) {
      this.pedidoForm.patchValue(this.pedido)
      this.fechaSelected = this.pedido.fecha;
      this.lineasSelected = this.pedido.lineas;
    }

    this._clienteService.getAll().subscribe(data => {
      this.clientes = data['data'].map((cliente: Cliente) => {
        const clienteFormateado: Cliente = {
          id: cliente.id,
          apellidoNombre: cliente.apellidoNombre,
          telefono: cliente.telefono,
          email: cliente.email,
          domicilio: cliente.domicilio,
          cuit: cliente.cuit,
          disponible: cliente.disponible,
          zona: cliente.zona
        };
        return clienteFormateado;
      });
    });
    this._pagoService.getAll().subscribe((pagos) => {
      this.pagos = pagos
    })
  }

  back() {
    this.editCrear.emit(false)
  }

  savePedido() {

    this.pedidoForm.controls['fecha'].setValue(this.fechaSelected);
    let totalValue = this.pedidoForm.value.total;

    // Convierte a número
    let totalInteger = Number(totalValue);

    // Si es un número válido, actualiza el valor del control 'total'
    if (!isNaN(totalInteger)) {
      this.pedidoForm.controls['total'].setValue(totalInteger);
    }

    if(this.pedido != null){
      console.log(this.pedidoForm.value)
      this._pedidoService.editar(this.pedidoForm.value).subscribe((ped)=>{
        Swal.fire({
          title: "Pedido guardado",
          text: "",
          icon: "success"
        });
        this.editCrear.emit()    
          },
          (err: any) => {
            Swal.fire({
              title: "No se pudo guardar el pedido",
              text: "",
              icon: "error"
            });
          });
      }
    else{
      this._pedidoService.guardar(this.pedidoForm.value).subscribe((ped) => {
        Swal.fire({
          title: "Pedido guardado",
          text: "",
          icon: "success"
        });
        this.editCrear.emit()    
          },
          (err: any) => {
            Swal.fire({
              title: "No se pudo guardar el pedido",
              text: "",
              icon: "error"
            });
          });
    }

    

  }

}
