import { CategoryModel } from "./category";
import { ImageModel } from "./image";
import { LocationModel } from "./location";

export class EventModel{

  constructor(
    public categoria_evento: CategoryModel,
    public contacto: number,
    public descripcion: string,
    public estado: string,
    public idcategoria: number,
    public idevento: number,
    public imagen_eventos: ImageModel[],
    public nombre: string,
    public ubicacions: LocationModel[]
  ){}

}