import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { ClientDto } from './dto/client.dto';

@Controller('')
export class ClientsController {
  constructor(private clientsService: ClientsService) {}

  @Get('clients')
  async getAll() {
    return await this.clientsService.findAll();
  }

  @Get('clients/:id')
  async getOne(@Param('id') id: number) {
    return await this.clientsService.findOne(id);
  }

  @Get('clients-to-do-follow-up')
  async getFollowUp() {
    return await this.clientsService.getFollowUp();
  }

  @Post('clients')
  async create(@Body() body: ClientDto) {
    return await this.clientsService.create(body);
  }

  @Get('clients/:id/score')
  async getScore(@Param('id') id: number) {
    return await this.clientsService.getScore(id);
  }
}
