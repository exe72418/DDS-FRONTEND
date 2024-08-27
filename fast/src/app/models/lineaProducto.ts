import { Pedido } from "./pedido";
import { Producto } from "./producto";

export class LineaDeProducto {

    id!: number

    producto!: Producto;

    pedido!: Pedido;

    cantidad!: number;

    subtotal!: number;
}