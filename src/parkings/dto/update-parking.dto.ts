import { PartialType } from '@nestjs/mapped-types';
import { CreateParkingDto } from './create-parking.dto';
import { IsNumber, IsString, Min } from 'class-validator';

export class UpdateParkingDto extends PartialType(CreateParkingDto) {
  @IsString()
  name?: string | undefined;

  @IsString()
  location?: string | undefined;

  @IsNumber()
  partner?: number | undefined;

  @IsNumber()
  @Min(0, { message: '"capacity" cannot be negative' })
  capacity?: number | undefined;

  @IsNumber()
  @Min(0, { message: '"costperhour" cannot be negative' })
  costperhour?: number | undefined;
}
