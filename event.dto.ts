// src/events/dto/event.dto.ts
import { IsNotEmpty, IsString, IsDate, IsOptional, IsISO8601 } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateEventDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsISO8601() // or @IsDateString if you prefer string format
  startTime: string; // Expecting ISO 8601 date-time string from frontend

  @IsNotEmpty()
  @IsISO8601() // or @IsDateString
  endTime: string;   // Expecting ISO 8601 date-time string
}

export class UpdateEventDto extends CreateEventDto { // Reusing validation from Create DTO, extend if needed
  @IsNotEmpty()
  id: number; // ID required for update
}
