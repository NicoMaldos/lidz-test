import { IsString, IsDate, IsNotEmpty } from 'class-validator';
import { MessageRole } from '../enums/messageRole.enum';

export class MessageDto {
  @IsString()
  @IsNotEmpty()
  text: string;

  @IsDate()
  @IsNotEmpty()
  sentAt: Date;

  @IsString()
  @IsNotEmpty()
  role: MessageRole;
}
