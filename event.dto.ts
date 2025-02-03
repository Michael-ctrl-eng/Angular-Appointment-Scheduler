// src/events/dto/event.dto.ts
import {
    IsNotEmpty,
    IsString,
    IsOptional,
    IsISO8601,
    Length,
    IsBoolean,
    ValidateIf,
    IsNotEmptyIf
} from 'class-validator';
import { Type } from 'class-transformer';


export class CreateEventDto {
    // ... (existing fields - title, description, startTime, endTime)

    @IsOptional()
    @IsBoolean({ message: 'Is Recurring must be a boolean' })
    isRecurring?: boolean;

    @IsOptional()
    @ValidateIf(o => o.isRecurring === true) // **Conditional validation: require recurrenceRule if isRecurring is true**
    @IsNotEmpty({ message: 'Recurrence Rule is required for recurring events' })
    @IsString({ message: 'Recurrence Rule must be a string' })
    recurrenceRule?: string;

    // ... (rest of DTO)
}

export class UpdateEventDto extends CreateEventDto {
    // ... (existing fields)

    @IsOptional()
    @ValidateIf(o => o.isRecurring === true) // **Conditional validation for update as well**
    @IsNotEmpty({ message: 'Recurrence Rule is required for recurring events' })
    @IsString({ message: 'Recurrence Rule must be a string' })
    recurrenceRule?: string;

    // ... (rest of UpdateEventDto)
}
