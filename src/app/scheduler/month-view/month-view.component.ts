import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { Event } from '../../event.model';
import { DatePipe } from '@angular/common';
import { getMonthView } from 'date-fns-timezone'; // Or date-fns equivalent
import { isSameMonth, isSameDay } from 'date-fns'; // date-fns for date comparison

interface MonthViewDay {
  date: Date;
  dayOfMonth: number;
  isPast: boolean;
  isToday: boolean;
  isFuture: boolean;
  isWeekend: boolean;
  inMonth: boolean; // Track if day is in the current month
  events: Event[];
}

@Component({
  selector: 'app-month-view',
  templateUrl: './month-view.component.html',
  styleUrls: ['./month-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MonthViewComponent implements OnChanges {
  @Input() events: Event[] | null = [];
  @Input() viewDate: Date = new Date();
  @Output() eventClicked = new EventEmitter<Event>();
  @Output() addEventClicked = new EventEmitter<Date>(); // Output day click for adding event
  @Output() viewDateChange = new EventEmitter<Date>(); // Output for when viewDate changes on day click

  viewDays: MonthViewDay[] = [];
  columnHeaders: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']; // Weekday headers

  constructor(private datePipe: DatePipe) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['viewDate'] || changes['events']) {
      this.viewDays = this.getMonthDays();
    }
  }

  private getMonthDays(): MonthViewDay[] {
    const monthView = getMonthView<Event>({
      viewDate: this.viewDate,
      events: this.events || []
    });

    return monthView.days.map(day => ({
      ...day,
      inMonth: isSameMonth(day.date, this.viewDate), // Determine if day is in current month
      events: day.events.sort((a, b) => a.start.getTime() - b.start.getTime()) // Sort events by start time
    }));
  }


  onDayClick(day: MonthViewDay): void {
    if (day.isPast || day.isToday || day.isFuture) { // Check if day is valid for navigation
      this.viewDateChange.emit(day.date); // Emit viewDate change for toolbar update and view refresh
    }
    if (day.isFuture || day.isToday) {
      this.addEventClicked.emit(day.date); // Emit add event clicked with the day's date
    }
  }

  onEventClick(event: Event): void {
    this.eventClicked.emit(event);
  }

  isEventDay(day: MonthViewDay): boolean {
    return day.events && day.events.length > 0;
  }

  getDayClasses(day: MonthViewDay): string {
    const classes = [];
    if (!day.inMonth) {
      classes.push('not-in-month');
    }
    if (day.isPast) {
      classes.push('past');
    }
    if (day.isToday) {
      classes.push('today');
    }
    if (day.isFuture) {
      classes.push('future');
    }
    if (day.isWeekend) {
      classes.push('weekend');
    }
    if (this.isEventDay(day)) {
      classes.push('event-day');
    }
    return classes.join(' ');
  }

  trackByViewDays(index: number, day: MonthViewDay): Date {
    return day.date; // Track month days by date
  }
  trackByIndex(index: number): number {
      return index; // Track column header index
  }
  trackByEvents(index: number, event: Event): number | undefined {
      return event.id; // Track events by ID
  }
}
