import { IsString, IsInt, IsDate, IsNotEmpty } from 'class-validator';

export class DebtDto {
  @IsInt()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsNotEmpty()
  institution: string;

  @IsDate()
  @IsNotEmpty()
  dueDate: Date;
}
