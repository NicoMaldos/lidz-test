import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Clients } from './clients.entity';

@Entity()
export class Debts {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  institution: string;

  @Column({ nullable: false })
  amount: number;

  @Column({ nullable: false })
  dueDate: Date;

  @OneToOne(() => Clients, (client) => client.debt)
  @JoinColumn()
  client: Clients;
}
