import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ROL } from '../enum/users.enum';
import { Parking } from 'src/parkings/entities/parking.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: ROL,
    default: ROL.ADMIN,
  })
  type: ROL;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Parking, (parking) => parking.partner)
  parkings: Parking[];

  @BeforeInsert()
  checkFueldsBeforeInsert() {
    this.email = this.email.toLowerCase().trim();
  }

  @BeforeUpdate()
  checkFueldsBeforeUpdate() {
    this.checkFueldsBeforeInsert();
  }
}
