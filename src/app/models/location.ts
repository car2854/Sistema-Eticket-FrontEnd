export class LocationModel{
  constructor(
    public cantidad_de_personas: number,
    public direccion: string,
    public idevento: number,
    public idubicacion: number,
    public latitud: number,
    public longitud: number,
    public nombre: string,
  ){}
}