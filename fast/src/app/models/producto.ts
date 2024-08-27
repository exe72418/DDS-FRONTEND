import { LineaDeProducto } from "./lineaProducto";
import { TipoProducto } from "./tipoProducto";

export class Producto {
    codigo!: number;
    descripcion!: string;
    stock!: number;
    precio!: number;
    tipoProducto!: TipoProducto;

    lineas! : LineaDeProducto[];
}
