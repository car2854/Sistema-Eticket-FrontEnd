export class EntradaVendida{
  constructor(
    public ticket: string,
    public horario: string,
    public sector: string,
    public espacio: string,
    public registrado_por: string,
    public hora_registro: string,
  ){}
}