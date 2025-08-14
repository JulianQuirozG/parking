import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

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
}
