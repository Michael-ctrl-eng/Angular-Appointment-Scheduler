// src/events/event.controller.ts
import { Controller, Get, Post, Put, Delete, Param, Body, UsePipes, ValidationPipe, ParseIntPipe, UseGuards, Request } from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto, UpdateEventDto } from './dto/event.dto';
import { AuthGuard } from '../auth/auth.guard'; // Assuming AuthGuard for protected endpoints

@Controller('events')
@UseGuards(AuthGuard) // Protect all event endpoints with AuthGuard (example)
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get()
  async findAll(@Request() req) { // Example: Request object can be used for user context if needed (via AuthGuard)
    // In real app, you might add filters, pagination, etc.
    return this.eventService.findAllForUser(req.user); // Example: service method to get events for current user
  }

  @Post()
  @UsePipes(new ValidationPipe()) // Apply validation pipe for CreateEventDto
  async create(@Body() createEventDto: CreateEventDto, @Request() req) {
    return this.eventService.create(createEventDto, req.user); // Pass user context to service
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.eventService.findOne(id, req.user);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe()) // Apply validation pipe for UpdateEventDto
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEventDto: UpdateEventDto,
    @Request() req
  ) {
    return this.eventService.update(id, updateEventDto, req.user);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.eventService.remove(id, req.user);
  }
}
