import { IsDefined, IsOptional, IsString, Min } from 'class-validator';

export class CreateParkingDto {
  @IsString({ message: `"name" must be a string` })
  name: string;

  @IsString({ message: `"location" must be a string` })
  location: string;

  @IsDefined({ message: `"capacity" cannot be null` })
  @Min(1, { message: `"capacity" must be greater than 0` })
  capacity: number;

  @IsDefined({ message: `"costperhour" cannot be null` })
  @Min(1, { message: `"costperhour" must be greater than 0` })
  costperhour: number;

  @IsOptional()
  partner: number;
}
