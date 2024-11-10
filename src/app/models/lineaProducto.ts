import { Pedido } from "./pedido";
import { Producto } from "./producto";

export class LineaDeProducto {

    id!: number

    producto!: Producto;

    cantidad!: number;

    subtotal!: number;

}