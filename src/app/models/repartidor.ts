import { Entrega } from "./entrega";
import { Zona } from "./zona";

export class Repartidor {

    id!: number
    cuit!: String;
    apellidoNombre!: String;

    vehiculo!: String;
    zona!: Zona;
    disponible!: boolean;

}