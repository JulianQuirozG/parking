import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUppercase,
  MaxLength,
  MinLength,
} from 'class-validator';

export class SenddMailDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(6)
  @IsUppercase()
  placa: string;

  @IsString()
  @IsNotEmpty()
  mensaje: string;

  @IsNumber()
  @IsNotEmpty()
  parqueaderoId: number;
}
