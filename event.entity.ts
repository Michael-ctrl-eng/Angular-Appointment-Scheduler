// src/events/entities/event.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../auth/entities/user.entity'; // Assuming user entity in auth module

@Entity('events') // Table name in PostgreSQL
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'timestamptz' }) // TIMESTAMP WITH TIME ZONE
  startTime: Date;

  @Column({ type: 'timestamptz' }) // TIMESTAMP WITH TIME ZONE
  endTime: Date;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @ManyToOne(() => User, user => user.events) // Relation to User entity (if needed)
  @JoinColumn({ name: 'user_id' }) // Foreign key column
  user: User;
}
