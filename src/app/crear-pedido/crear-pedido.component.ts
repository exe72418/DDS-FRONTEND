import { Component, Input, OnInit } from '@angular/core';
import { Pedido } from '../models/pedido';
import { ClienteService } from '../services/cliente.service';
import { Cliente } from '../models/cliente';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PagoService } from '../services/pago.service';
import { Pago } from '../models/pago';
import { PedidoServiceService } from '../services/pedido-service.service';

@Component({
  selector: 'app-crear-pedido',
  templateUrl: './crear-pedido.component.html',
  styleUrl: './crear-pedido.component.css'
})
export class CrearPedidoComponent implements OnInit {


  @Input() pedido!:Pedido;
  clientes!: Cliente[];
  clienteSelected!: Cliente;
  fechaSelected!: Date;
  pagoSelected!: boolean;
  entregaSelected!: boolean;
  pedidoForm!:FormGroup;
  pagos!: Pago[];

  constructor(private _clienteService: ClienteService, private _pagoService: PagoService,
    private _pedidoService: PedidoServiceService
  ){

  }
  ngOnInit(): void {

    this.pedidoForm = new FormGroup({
      nroPedido:new FormControl(''),
      cliente: new FormControl('', [Validators.required]),
      lineas: new FormControl('', [Validators.required]),
      fecha:new FormControl(''),
      total:new FormControl(''),
      entrega:new FormControl(''),
      pago:new FormControl('')

    })
    if(this.pedido){
      this.pedidoForm.patchValue(this.pedido)
      this.clienteSelected = this.pedido.cliente;
      this.fechaSelected = this.pedido.fecha;
      this.pagoSelected = this.pedido.pago ? true : false;
      this.entregaSelected = this.pedido.entrega? true : false;
    }

    console.log(this.pedidoForm.value)
    
    

    this._clienteService.getAllClients().subscribe(data => {
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
      console.log(data['data'][0]);
    });
    this._pagoService.getAll().subscribe((pagos)=>{
      console.log(pagos)
      this.pagos = pagos
    })
  }

  savePedido() {
    let totalValue = this.pedidoForm.value.total;

    // Convierte a número
    let totalInteger = Number(totalValue);

    // Si es un número válido, actualiza el valor del control 'total'
    if (!isNaN(totalInteger)) {
      this.pedidoForm.controls['total'].setValue(totalInteger);
    }
    console.log(this.pedidoForm.value)
    this._pedidoService.guardar(this.pedidoForm.value).subscribe((ped)=>{
      console.log(ped)
    }, 
    (err: any) => {
        console.log(err);    
      });
    
  }

}
