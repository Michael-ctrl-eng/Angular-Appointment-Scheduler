import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { Event } from '../../event.model';
import { DatePipe } from '@angular/common';
import { getWeekView, getWeekViewHeader } from 'date-fns-timezone'; // Or date-fns equivalent

interface WeekViewDay {
  date: Date;
  dayOfMonth: number;
  isPast: boolean;
  isToday: boolean;
  isFuture: boolean;
  isWeekend: boolean;
}

interface WeekViewEventRow {
  row: DayViewEvent[]; // Reusing DayViewEvent interface as it's structurally similar for week view rendering
}

interface DayViewEvent { // Re-declare DayViewEvent interface as it's needed here
  event: Event;
  styles: {
    top: string;
    height: string;
    left: string;
    width: string;
  };
  span: number;
  offset: number;
  startsAt: Date;
  endsAt: Date;
}

@Component({
  selector: 'app-week-view',
  templateUrl: './week-view.component.html',
  styleUrls: ['./week-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WeekViewComponent implements OnChanges {
  @Input() events: Event[] | null = [];
  @Input() viewDate: Date = new Date();
  @Output() eventClicked = new EventEmitter<Event>();
  @Output() addEventClicked = new EventEmitter<void>();

  viewDays: WeekViewDay[] = [];
  viewEventRows: WeekViewEventRow[] = [];
  hours: number[] = Array.from({ length: 24 }, (_, i) => i); // 0 to 23 hours

  constructor(private datePipe: DatePipe) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['viewDate'] || changes['events']) {
      this.viewDays = this.getWeekDays();
      this.viewEventRows = this.getWeekEvents();
    }
  }

  private getWeekDays(): WeekViewDay[] {
    return getWeekViewHeader({
      viewDate: this.viewDate,
    }) as WeekViewDay[]; // Cast is safe as getWeekViewHeader returns compatible array
  }

  private getWeekEvents(): WeekViewEventRow[] {
    if (!this.events) return [];

    const { eventRows } = getWeekView<Event>({
      events: this.events,
      viewDate: this.viewDate,
      hourSegments: 2,
      dayStart: { hour: 0, minute: 0 },
      dayEnd: { hour: 23, minute: 59 },
    });

    return eventRows.map(row => ({
      row: row.map((dayViewEvent) => ({ // Map each DayViewEvent within the row
        ...dayViewEvent,
        startsAt: dayViewEvent.event.start,
        endsAt: dayViewEvent.event.end
      }))
    }));
  }

  onEventClick(viewEvent: DayViewEvent): void {
    this.eventClicked.emit(viewEvent.event);
  }

  onAddEventClick(): void {
    this.addEventClicked.emit();
  }

  formatHour(hour: number): string {
    return this.datePipe.transform(new Date().setHours(hour, 0, 0, 0), 'ha');
  }

  trackByViewEvents(index: number, event: DayViewEvent): number | undefined {
    return event.event.id;
  }
  trackByEventRows(index: number, row: WeekViewEventRow): number {
    return index; // Row index as unique key - may need to improve if rows re-ordering is needed
  }
  trackByViewDays(index: number, day: WeekViewDay): Date {
      return day.date; // Track week days by date
  }
  trackByIndex(index: number): number {
      return index; // Track hours by index
  }
}
