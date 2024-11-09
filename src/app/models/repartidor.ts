import { Entrega } from "./entrega";

export class Repartidor {

    id!: number
    cuit!: number;
    apellidoNombre!: String;

    vehiculo!: String;
    zona!: String;
    disponible!: boolean;

    ///entregas! : Entrega []
}