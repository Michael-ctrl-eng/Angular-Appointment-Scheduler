import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { EventFormComponent } from '../shared/event-form/event-form.component';
import { Event } from '../event.model';
import { ViewType } from './scheduler-toolbar/scheduler-toolbar.component';
import { SchedulerService } from './scheduler.service';
import { Observable, Subject, takeUntil, BehaviorSubject } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Component({ /* ... */ })
export class SchedulerComponent implements OnInit, OnDestroy {
  events$: Observable<Event[]> = this.schedulerService.events$;
  currentView: ViewType = 'month';
  selectedDate$: BehaviorSubject<Date> = new BehaviorSubject<Date>(new Date()); // Keep BehaviorSubject
  isEventFormDialogOpen = false;
  eventFormDialogRef: MatDialogRef<EventFormComponent> | null = null;
  private destroyed$ = new Subject<void>();

  constructor( /* ... */ ) { }

  ngOnInit(): void { /* ... */ }
  ngOnDestroy(): void { /* ... */ }

  onViewChange(view: ViewType): void {
    this.currentView = view;
  }

  onDateChange(date: Date): void {
    this.selectedDate$.next(date); // Update selectedDate using BehaviorSubject
  }

  onViewDateChangeFromMonth(date: Date): void { // Handle viewDate change from month view
      this.selectedDate$.next(date); // Update selectedDate in SchedulerComponent
  }

  // ... (rest of the component code: openAddDialog, openEditDialog, deleteEvent, logout) ...
}
