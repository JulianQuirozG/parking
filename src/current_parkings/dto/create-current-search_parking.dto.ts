import {
  IsNumber,
  IsOptional,
  IsString,
  IsUppercase,
  Matches,
  MaxLength,
} from 'class-validator';

export class CurrentParkingSearchDto {
  @IsString()
  @IsUppercase()
  @MaxLength(6)
  @Matches(/^[A-Za-z0-9]/, {
    message:
      'La placa solo puede contener letras y números, sin caracteres especiales ni la letra ñ',
  })
  plate: string;

  @IsOptional()
  @IsNumber()
  parking: number;

  initDay: Date;
}
