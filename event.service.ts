// src/events/event.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './entities/event.entity';
import { CreateEventDto, UpdateEventDto } from './dto/event.dto';
import { User } from '../auth/entities/user.entity';
import { RRule, rrulestr } from 'rrule'; // Import rrule.js

@Injectable()
export class EventService {
    constructor(
        @InjectRepository(Event)
        private eventsRepository: Repository<Event>,
    ) { }

    async create(createEventDto: CreateEventDto, user: User): Promise<Event> {
        const event = this.eventsRepository.create({
            ...createEventDto,
            startTime: new Date(createEventDto.startTime),
            endTime: new Date(createEventDto.endTime),
            user: user,
        });
        return this.eventsRepository.save(event);
    }


    async findAllForUser(user: User): Promise<Event[]> {
        const events = await this.eventsRepository.find({ where: { user: { id: user.id } }, relations: ['user'] });
        return this.expandRecurringEvents(events); // **Expand recurring events before returning**
    }

    private expandRecurringEvents(events: Event[]): Event[] {
        const expandedEvents: Event[] = [];
        for (const event of events) {
            if (event.isRecurring && event.recurrenceRule) {
                try {
                    const rrule = rrulestr(event.recurrenceRule, { dtstart: event.startTime }); // Parse RRULE, set dtstart
                    const now = new Date();
                    const futureInstances = rrule.between(now, new Date(now.getFullYear() + 1, now.getMonth(), now.getDate()), true, 50); // Expand for a limited future range (e.g., next year, max 50 instances - adjust limits!)


                    for (const instanceDate of futureInstances) {
                        const instanceEndTime = new Date(instanceDate.getTime() + (event.endTime.getTime() - event.startTime.getTime())); // Calculate instance end time based on original event duration
                        expandedEvents.push({
                            ...event, // Base event properties
                            id: `recurring-${event.id}-${instanceDate.getTime()}`, // Unique ID for each instance (important for frontend keying)
                            startTime: instanceDate,
                            endTime: instanceEndTime,
                            isRecurring: false, // Instance is not recurring itself
                            recurrenceRule: null, // Instance doesn't have recurrence rule
                            // ...(adjust any other properties as needed for instances)
                        });
                    }
                } catch (error) {
                    console.error(`Error expanding recurring event ${event.id}:`, error); // Handle RRULE parsing errors
                    // For robust error handling, consider logging errors properly or adding error-specific behavior
                }
            } else {
                expandedEvents.push(event); // Add non-recurring events directly
            }
        }
        return expandedEvents;
    }


    async update(id: number, updateEventDto: UpdateEventDto, user: User): Promise<Event> {
        // ... (rest of update logic is largely the same) ...
    }

    async remove(id: number, user: User): Promise<void> {
       // ... (rest of remove logic is largely the same) ...
    }
}
