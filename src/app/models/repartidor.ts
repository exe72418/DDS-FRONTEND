import { Entrega } from "./entrega";
import { Zona } from "./zona";

export class Repartidor {

    id!: number
    cuit!: number;
    apellidoNombre!: String;

    vehiculo!: String;
    zona!: Zona;
    disponible!: boolean;

}