import { Zona } from "./zona";

export class Cliente {
  apellidoNombre!: string;
  id!: number;
  telefono!: string;
  email!: string;
  domicilio!: string;
  cuit!: string;
  disponible!: boolean;
  zona!: Zona;
}