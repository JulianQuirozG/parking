import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class loginDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
