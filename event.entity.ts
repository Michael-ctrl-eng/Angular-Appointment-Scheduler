// src/events/entities/event.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../auth/entities/user.entity';

@Entity('events')
export class Event {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255 })
    title: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ type: 'timestamptz' })
    startTime: Date;

    @Column({ type: 'timestamptz' })
    endTime: Date;

    @Column({ type: 'boolean', default: false }) // **New Column: Indicate if recurring**
    isRecurring: boolean;

    @Column({ type: 'text', nullable: true })  // **New Column: Store Recurrence Rule (e.g., iCalendar RRULE)**
    recurrenceRule: string;


    @CreateDateColumn({ type: 'timestamptz' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    updatedAt: Date;

    @ManyToOne(() => User, user => user.events)
    @JoinColumn({ name: 'user_id' })
    user: User;
}
