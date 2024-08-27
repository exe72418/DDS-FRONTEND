import { Cliente } from "./cliente";
import { LineaDeProducto } from "./lineaProducto";

export class Pedido {
    nroPedido?: number

    fecha!: Date;

    total!: number;

    cliente!: Cliente;

    //entrega!: Entrega;

    //pago!: Pago;

    lineas! : LineaDeProducto[];
}
