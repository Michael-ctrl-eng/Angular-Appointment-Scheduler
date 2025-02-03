// src/events/event.module.ts
import { Module } from '@nestjs/common';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Event])], // Import TypeOrmModule for Event entity
  controllers: [EventController],
  providers: [EventService],
  exports: [EventService], // If you need to use EventService in other modules
})
export class EventModule {}
