import { Repartidor } from "./repartidor";
import { Pedido } from "./pedido";

export class Entrega {

    id!: number

    fecha!: Date;

    lote!: number;

    zona!: string;

    repartidor!: Repartidor;

    pedidos: Pedido[] = [];
}