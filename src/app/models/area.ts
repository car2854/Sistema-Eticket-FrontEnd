import { SpaceModel } from "./space";

export class AreaModel{
  constructor(
    public idsector:number,
    public nombre:string,
    public capacidad:number,
    public referencia:string,
    public idubicacion:number,
    public espacios: SpaceModel[]
  ){}
}