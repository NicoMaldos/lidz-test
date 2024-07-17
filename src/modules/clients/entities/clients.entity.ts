import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Debts } from './debts.entity';
import { Messages } from './messages.entity';

@Entity()
export class Clients {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  rut: string;

  @Column({ nullable: false })
  salary: number;

  @Column({ nullable: false })
  savings: number;

  @Column({ nullable: false })
  age: number;

  @Column({ nullable: false })
  undueDebt: number;

  @OneToMany(() => Debts, (debt) => debt.client, { cascade: true })
  debts: Debts[];

  @OneToMany(() => Messages, (message) => message.client, { cascade: true })
  messages: Messages[];
}
