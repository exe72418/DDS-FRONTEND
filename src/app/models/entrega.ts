import { Repartidor } from "./repartidor";
import { Pedido } from "./pedido";
import { Zona } from "./zona";

export class Entrega {

    id!: number

    fecha!: Date;

    lote!: number;

    zona!: Zona;

    repartidor!: Repartidor;

    pedidos: Pedido[] = [];
}