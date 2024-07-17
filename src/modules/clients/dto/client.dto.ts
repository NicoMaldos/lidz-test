import {
  IsString,
  IsInt,
  IsArray,
  ValidateNested,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';
import { MessageDto } from './message.dto';
import { DebtDto } from './debt.dto';

export class ClientDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  rut: string;

  @IsInt()
  @IsNotEmpty()
  salary: number;

  @IsInt()
  @IsNotEmpty()
  savings: number;

  @IsInt()
  @IsNotEmpty()
  age: number;

  @IsInt()
  @IsNotEmpty()
  undueDebt: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MessageDto)
  @IsNotEmpty()
  messages: MessageDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DebtDto)
  @IsNotEmpty()
  debts: DebtDto[];
}
