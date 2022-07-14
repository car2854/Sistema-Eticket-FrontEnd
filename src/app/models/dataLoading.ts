import { EntradaVendida } from "./entradaVendida";

export class DataLoading{

  constructor(
    public evento: string,
    public ubicacion: string,
    public entradas_vendidas: EntradaVendida[],
  ){}

}
