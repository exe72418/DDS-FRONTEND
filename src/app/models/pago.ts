import { TipoPago } from "./tipopago";
import { Pedido } from "./pedido";

export class Pago {

    id!: number;

    fecha!: Date;

    tipoPago!: TipoPago;

    pedido?: Pedido;
}