import { Parking } from 'src/parkings/entities/parking.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class HistoryParking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  plate: string;

  @Column()
  initDay: Date;

  @Column()
  finishDay: Date;

  @ManyToOne(() => Parking, (parking) => parking.history)
  parking: Parking;
}
