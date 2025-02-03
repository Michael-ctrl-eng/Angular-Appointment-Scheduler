// src/events/dto/event.dto.ts
import {
    IsNotEmpty,
    IsString,
    IsOptional,
    IsISO8601,
    Length,
    IsBoolean,
    IsIn,
    ValidateNested,
    IsInt,
    Min,
    Max,
    ArrayMinSize,
    ArrayMaxSize,
    ArrayUnique,
    IsEmail,
    IsUrl,
    IsPhoneNumber,
    Equals,
    NotEquals,
    Matches,
    MaxLength,
    MinLength,
    Contains,
    NotContains,
    IsDefined,
    IsEnum,
    IsNumberString,
    IsDateString,
    IsPositive,
    IsNegative,
    IsNumber,
    IsArray,
    ValidateIf
} from 'class-validator';
import { Type } from 'class-transformer';
import { EventCategory } from '../entities/event.entity'; // Assuming EventCategory enum exists


export class CreateEventDto {
    @IsDefined() // Ensures the property is defined (not undefined)
    @IsNotEmpty({ message: 'Title cannot be empty' }) // More descriptive error message
    @IsString({ message: 'Title must be a string' })
    @Length(3, 255, { // Example length constraints
        message: 'Title must be between 3 and 255 characters'
    })
    title: string;

    @IsOptional() // Optional property, validation will only run if present
    @IsString({ message: 'Description must be a string' })
    @MaxLength(1000, { message: 'Description cannot exceed 1000 characters' })
    description?: string;

    @IsNotEmpty({ message: 'Start Time is required' })
    @IsISO8601({ message: 'Start Time must be a valid ISO 8601 date-time string' }, { each: false }) // Strict ISO 8601 format
    startTime: string;

    @IsNotEmpty({ message: 'End Time is required' })
    @IsISO8601({ message: 'End Time must be a valid ISO 8601 date-time string' }, { each: false })
    endTime: string;

    @IsOptional()
    @IsBoolean({ message: 'Is Recurring must be a boolean' })
    isRecurring?: boolean;

    @IsOptional()
    @IsEnum(EventCategory, { message: 'Category must be a valid EventCategory' }) // Example Enum validation
    category?: EventCategory; // Assuming you have an EventCategory enum in your entity or models


    @IsOptional()
    @IsInt({ message: 'Priority must be an integer' })
    @Min(1, { message: 'Priority must be at least 1' })
    @Max(5, { message: 'Priority cannot exceed 5' })
    priority?: number;


    @IsOptional()
    @IsArray({ message: 'Attendees must be an array' })
    @ArrayMinSize(1, { message: 'At least one attendee is required' })
    @ArrayMaxSize(10, { message: 'Maximum 10 attendees allowed' })
    @ArrayUnique({ message: 'Attendees must be unique' })
    @ValidateNested({ each: true }) // Important for validating array of objects
    @Type(() => AttendeeDto) // If you have a nested Attendee DTO - example structure
    attendees?: AttendeeDto[]; // Example: array of attendee objects


    @IsOptional() // Example Conditional validation - only if isRecurring is true
    @ValidateIf(o => o.isRecurring === true) // Apply validation only if isRecurring is true
    @IsString({ message: 'Recurrence Rule must be a string if recurring event' })
    recurrenceRule?: string; // Example field for iCalendar recurrence rules
}


export class UpdateEventDto extends CreateEventDto { // Reusing and extending validation
    @IsNotEmpty({ message: 'ID is required for update' })
    @IsInt({ message: 'ID must be an integer' })
    id: number; // ID is required for updates, validated as integer


    @IsOptional() // Example of adding a validation rule only for Update
    @IsIn(['Draft', 'Published', 'Cancelled'], { message: 'Status must be a valid status value' })
    status?: string; // Example: Status update, validated against allowed values


    @IsOptional() // Example for conditional presence in Update, but not required for Create
    @IsString({ message: 'Update Notes must be a string, if provided' })
    updateNotes?: string;
}


export class AttendeeDto { // Example Nested DTO - for Attendees
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsOptional()
    @IsEmail({}, { message: 'Email must be a valid email address' })
    email?: string;

    @IsOptional()
    @IsPhoneNumber('US', { message: 'Phone number must be a valid US phone number' }) // Example locale-based validator
    phoneNumber?: string;
}
