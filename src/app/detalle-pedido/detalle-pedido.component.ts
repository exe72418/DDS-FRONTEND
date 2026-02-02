import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-detalle-pedido',
  templateUrl: './detalle-pedido.component.html',
  styleUrls: ['./detalle-pedido.component.css'] 
})
export class DetallePedidoComponent implements OnInit {

  lineas: any[] = [];
  nroPedido: number = 0;
  total: number = 0;

  constructor(
    public dialogRef: MatDialogRef<DetallePedidoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.lineas = data.lineas;
    this.nroPedido = data.nroPedido;
  }

  ngOnInit(): void {
    this.total = this.lineas.reduce((acc, linea) => acc + (linea.subtotal), 0);
  }

  cerrar(): void {
    this.dialogRef.close();
  }
}