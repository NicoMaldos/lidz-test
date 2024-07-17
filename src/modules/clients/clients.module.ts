import { Module } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { ClientsController } from './clients.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Clients } from './entities/clients.entity';
import { Debts } from './entities/debts.entity';
import { Messages } from './entities/messages.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Clients, Debts, Messages])],
  providers: [ClientsService],
  controllers: [ClientsController],
})
export class ClientsModule {}
