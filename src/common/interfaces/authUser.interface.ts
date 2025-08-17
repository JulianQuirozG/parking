import { ROL } from 'src/users/enum/users.enum';

export interface AuthUser {
  sub: string; // id del usuario
  username: string; // nombre del usuario
  role: ROL; // tipo o rol
}
