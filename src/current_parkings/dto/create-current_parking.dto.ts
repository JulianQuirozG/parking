import { IsNumber, IsString, MaxLength, MinLength } from 'class-validator';

export class CurrentParkingDto {
  @IsString()
  @MinLength(6)
  @MaxLength(6)
  plate: string;

  @IsNumber()
  parking: number;

  initDay: Date;
}
