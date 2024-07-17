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

    //get all messages and filter the ones that are too old
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

    //create new client and add fields
    const client = new Clients();
    client.name = name;
    client.rut = rut;
    client.salary = salary;
    client.savings = savings;
    client.age = age;
    client.undueDebt = undueDebt;

    //add messages to new client
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

    //add debts to new client
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
    //3000 UF to CLP
    const propertyValue = 112791000;
    const downPayment = propertyValue * 0.2;

    const client = await this.ClientsRepo.findOne({
      relations: ['debts', 'messages'],
      where: { id: clientId },
    });
    let score = 0;

    const ageScore = this.ageScoreCalculator(client);
    score += ageScore * 0.1;

    const messagesScore = this.messagesScoreCalculator(client);
    score += messagesScore * 0.1;

    const savingDebtsScore = this.savingDebtScoreCalculator(
      client,
      downPayment,
    );
    score += savingDebtsScore * 0.3;

    const undueDebtScore = this.undueDebtScoreCalculator(client);
    score += undueDebtScore * 0.2;

    const salaryScore = this.salaryScoreCalculator(client, propertyValue);
    if (salaryScore) {
      score = (score / 0.7) * 0.4;
    }
    score += salaryScore * 0.3;

    //penalty for debt in dicom with high amount and old
    const oneYearAgo = new Date();
    oneYearAgo.setDate(oneYearAgo.getDate() - 365);
    const havePenlaty = client.debts.find(
      (debt) => debt.amount > 1000000 && debt.dueDate < oneYearAgo,
    );
    if (havePenlaty) {
      if (score > 20) {
        score -= 20;
      } else {
        score = 0;
      }
    }
    return parseInt(score.toFixed());
  }

  ageScoreCalculator(client: ClientDto): number {
    if (20 < client.age && client.age < 70) {
      const ageScore = 100 - Math.abs(client.age - 45) * 4;
      return ageScore;
    }
    return 0;
  }

  messagesScoreCalculator(client: ClientDto): number {
    let messagesScore;
    if (client.messages.length > 10) {
      messagesScore = 100;
    } else {
      messagesScore = client.messages.length * 10;
    }
    return messagesScore;
  }

  savingDebtScoreCalculator(client: ClientDto, downPayment: number): number {
    const totalDebts = client.debts.reduce(
      (accumulator, currentValue) => accumulator + currentValue.amount,
      0,
    );
    const savingDebts = client.savings - totalDebts;
    let savingDebtsScore;
    if (savingDebts >= downPayment * 1.2) {
      savingDebtsScore = 100;
    } else if (savingDebts < downPayment * 0.3) {
      savingDebtsScore = 0;
    } else {
      savingDebtsScore = this.linearScoreCalculator(
        downPayment * 0.3,
        downPayment * 1.2,
        savingDebts,
      );
    }
    return savingDebtsScore;
  }

  undueDebtScoreCalculator(client: ClientDto) {
    let undueDebtScore;
    const minimumInstallment = this.installmentCalculator(client.undueDebt, 30);
    if (minimumInstallment === 0) {
      return 100;
    } else if (client.salary * 0.2 < minimumInstallment) {
      undueDebtScore = 0;
    } else {
      undueDebtScore = this.linearScoreCalculator(
        minimumInstallment / 0.2,
        0,
        client.salary,
      );
    }
    return undueDebtScore;
  }

  salaryScoreCalculator(client: ClientDto, propertyValue: number) {
    let salaryScore;
    const tenYearInstallment = this.installmentCalculator(
      propertyValue * 0.8,
      10,
    );
    const thirtyYearInstallment = this.installmentCalculator(
      propertyValue * 0.8,
      30,
    );
    if (client.salary * 0.2 > tenYearInstallment) {
      salaryScore = 100;
    } else if (client.salary * 0.6 < thirtyYearInstallment) {
      salaryScore = 0;
    } else {
      salaryScore = this.linearScoreCalculator(
        thirtyYearInstallment / 0.6,
        tenYearInstallment / 0.2,
        client.salary,
      );
    }
    return salaryScore;
  }

  //get the installment with simple interest
  installmentCalculator(totalCredit: number, years: number): number {
    const cae = 0.05;
    if (totalCredit === 0) {
      return 0;
    } else {
      const minimumInstallment = (totalCredit / (years * 12)) * (1 + cae / 12);
      return minimumInstallment;
    }
  }

  //get score by the linear equation
  linearScoreCalculator(
    minimumX: number,
    maximumX: number,
    actualValue: number,
  ): number {
    //value names is because of linear equation standars
    const m = 100 / (maximumX - minimumX);
    const b = -m * minimumX;
    const score = m * actualValue + b;
    return score;
  }
}
