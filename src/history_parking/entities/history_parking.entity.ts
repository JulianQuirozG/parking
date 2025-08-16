import { Parking } from 'src/parkings/entities/parking.entity';
import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity()
export class HistoryParking {
  @PrimaryColumn()
  id: number;

  @Column()
  plate: string;

  @Column()
  initDay: Date;

  @Column()
  finishDay: Date;

  @Column({ type: 'float', default: 0 })
  Amount: number;

  @ManyToOne(() => Parking, (parking) => parking.history)
  parking: Parking;
}
