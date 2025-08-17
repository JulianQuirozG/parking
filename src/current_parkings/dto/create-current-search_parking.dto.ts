import { IsNumber, IsString, IsUppercase, Matches } from 'class-validator';

export class CurrentParkingSearchDto {
  @IsString()
  @IsUppercase()
  @Matches(/^[A-Za-z0-9]/, {
    message:
      'La placa solo puede contener letras y números, sin caracteres especiales ni la letra ñ',
  })
  plate: string;

  @IsNumber()
  parking: number;

  initDay: Date;
}
