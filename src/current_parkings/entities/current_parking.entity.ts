import { Parking } from 'src/parkings/entities/parking.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CurrentParking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  plate: string;

  @Column()
  initDay: Date;

  @ManyToOne(() => Parking, (parking) => parking.current)
  parking: Parking;
}
