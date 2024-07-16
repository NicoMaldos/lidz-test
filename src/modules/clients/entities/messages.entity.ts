import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Clients } from './clients.entity';
import { MessageRole } from '../enums/messageRole.enum';

@Entity()
export class Messages {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  text: string;

  @Column({
    type: 'enum',
    enum: MessageRole,
    nullable: false,
    default: null,
  })
  role: MessageRole;

  @Column({ nullable: false })
  sentAt: Date;

  @ManyToOne(() => Clients, (client) => client.messages)
  client: Clients;
}
