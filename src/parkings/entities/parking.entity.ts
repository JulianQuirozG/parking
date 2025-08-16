import { CurrentParking } from 'src/current_parkings/entities/current_parking.entity';
import { HistoryParking } from 'src/history_parking/entities/history_parking.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Parking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  location: string;

  @Column()
  capacity: number;

  @Column({ default: 0 })
  used: number;

  @Column()
  costperhour: number;

  @ManyToOne(() => User, (user) => user.parkings)
  partner: User;

  @OneToMany(() => CurrentParking, (currentParking) => currentParking.parking)
  current: [CurrentParking];

  @OneToMany(() => HistoryParking, (historyParking) => historyParking.parking)
  history: [HistoryParking];
}
