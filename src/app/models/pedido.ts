import { Cliente } from "./cliente";
import { Entrega } from "./entrega";
import { LineaDeProducto } from "./lineaProducto";
import { Pago } from "./pago";

export class Pedido {
    nroPedido?: number

    fecha!: Date;

    total!: number;

    cliente!: Cliente;

    entrega!: Entrega;

    pago!: Pago;

    lineas! : LineaDeProducto[];
}
