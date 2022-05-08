export class LocationModel{
  constructor(
    public cantidad_de_persona: number,
    public direccion: string,
    public idevento: number,
    public idubicacion: number,
    public latitud: string,
    public longitud: string,
    public nombre: string,
  ){}
}