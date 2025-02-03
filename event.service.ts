// src/events/event.service.ts
import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './entities/event.entity';
import { CreateEventDto, UpdateEventDto } from './dto/event.dto';
import { User } from '../auth/entities/user.entity'; // Assuming User entity

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event)
    private eventsRepository: Repository<Event>,
  ) {}

  async findAllForUser(user: User): Promise<Event[]> { // Example service method for user-specific events
    // In real app, add proper querying, filtering, etc. based on user roles and permissions
    return this.eventsRepository.find({ where: { user: { id: user.id } }, relations: ['user'] }); // Fetch events related to user - adapt based on your authz needs
  }

  async create(createEventDto: CreateEventDto, user: User): Promise<Event> {
    const event = this.eventsRepository.create({
      ...createEventDto,
      startTime: new Date(createEventDto.startTime), // Convert string to Date - consider timezone handling
      endTime: new Date(createEventDto.endTime),     // Convert string to Date
      user: user, // Associate event with the user (if applicable)
    });
    return this.eventsRepository.save(event);
  }

  async findOne(id: number, user: User): Promise<Event> { // Example findOne method
    const event = await this.eventsRepository.findOne({ where: { id, user: { id: user.id } }, relations: ['user'] });
    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
    return event;
  }

  async update(id: number, updateEventDto: UpdateEventDto, user: User): Promise<Event> {
    const event = await this.findOne(id, user); // Re-use findOne to ensure event exists and user authorized
    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
    this.eventsRepository.merge(event, {
      ...updateEventDto,
      startTime: updateEventDto.startTime ? new Date(updateEventDto.startTime) : event.startTime, // Update start time if provided
      endTime: updateEventDto.endTime ? new Date(updateEventDto.endTime) : event.endTime,     // Update end time if provided
      // user: user, // If user is updatable - might not be a common case, or need different logic
    });
    return this.eventsRepository.save(event);
  }

  async remove(id: number, user: User): Promise<void> {
    const event = await this.findOne(id, user);
    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
    await this.eventsRepository.remove(event);
  }
}
