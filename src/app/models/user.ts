export class UserModel {
  constructor(
    public id: string,
    public email: string,
    public estado: string,
    public nombre_usuario: string,
    public nombre: string,
    public rol: string,
    public token: string
  ){}
}