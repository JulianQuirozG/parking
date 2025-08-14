/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { ROL } from '../enum/users.enum';

export class CreateUserDto {
  @IsNotEmpty({ message: 'El campo nombre no puede estar vacio' })
  name: string;

  type: ROL.SOCIO;

  @IsEmail({}, { message: 'El email no es válido' })
  email: string;

  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;
}
