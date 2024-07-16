import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
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

  @ManyToOne(() => Clients, (client) => client.debts)
  client: Clients;
}
