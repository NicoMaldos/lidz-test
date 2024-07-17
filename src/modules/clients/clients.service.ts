import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Clients } from './entities/clients.entity';
import { LessThan, Repository } from 'typeorm';
import { ClientDto } from './dto/client.dto';
import { Messages } from './entities/messages.entity';
import { Debts } from './entities/debts.entity';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Clients) private ClientsRepo: Repository<Clients>,
    @InjectRepository(Messages) private MessagesRepo: Repository<Messages>,
    @InjectRepository(Debts) private DebtsRepo: Repository<Debts>,
  ) {}

  async findAll(): Promise<Clients[]> {
    const clients = await this.ClientsRepo.find();
    return clients;
  }

  async findOne(clientId: number): Promise<Clients> {
    const client = await this.ClientsRepo.findOne({
      relations: ['debts', 'messages'],
      where: {
        id: clientId,
      },
    });
    return client;
  }

  async getFollowUp(): Promise<Clients[]> {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const oldMessages = await this.MessagesRepo.find({
      where: { sentAt: LessThan(sevenDaysAgo) },
      relations: ['client'],
    });
    const clients = Array.from(
      new Set(oldMessages.map((message) => message.client)),
    );
    return clients;
  }

  async create(clientBody: ClientDto): Promise<Clients> {
    const { name, rut, salary, savings, age, undueDebt, messages, debts } =
      clientBody;

    const client = new Clients();
    client.name = name;
    client.rut = rut;
    client.salary = salary;
    client.savings = savings;
    client.age = age;
    client.undueDebt = undueDebt;

    if (messages.length > 0) {
      client.messages = await Promise.all(
        messages.map(async (message) => {
          const newMessage = new Messages();
          newMessage.text = message.text;
          newMessage.sentAt = message.sentAt;
          newMessage.role = message.role;
          return await this.MessagesRepo.save(newMessage);
        }),
      );
    }

    if (debts.length > 0) {
      client.debts = await Promise.all(
        debts.map(async (debt) => {
          const newDebt = new Debts();
          newDebt.institution = debt.institution;
          newDebt.dueDate = debt.dueDate;
          newDebt.amount = debt.amount;
          return await this.DebtsRepo.save(newDebt);
        }),
      );
    }
    await this.ClientsRepo.save(client);

    return client;
  }

  async getScore(clientId: number): Promise<number> {
    await this.ClientsRepo.findOne({
      relations: ['debts', 'messages'],
      where: { id: clientId },
    });
    return 50;
  }
}
