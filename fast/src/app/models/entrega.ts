import { Pedido } from "./pedido";
import { Repartidor } from "./repartidor";

export class Entrega {

    id!: number

    fecha!: Date;

    lote!: number;

    zona!: string;

    repartidor!: Repartidor;

    pedidos!: Pedido
}