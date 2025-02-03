import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { Event } from '../../event.model';
import { DatePipe } from '@angular/common';
import { getDayView } from 'date-fns-timezone'; // Assuming you'll use date-fns-timezone or similar

interface DayViewEvent {
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
  selector: 'app-day-view',
  templateUrl: './day-view.component.html',
  styleUrls: ['./day-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DayViewComponent implements OnChanges {
  @Input() events: Event[] | null = [];
  @Input() viewDate: Date = new Date();
  @Output() eventClicked = new EventEmitter<Event>();
  @Output() addEventClicked = new EventEmitter<void>();

  viewEvents: DayViewEvent[] = [];
  hours: number[] = Array.from({ length: 24 }, (_, i) => i); // 0 to 23 hours

  constructor(private datePipe: DatePipe) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['viewDate'] || changes['events']) {
      this.viewEvents = this.getDayEvents();
    }
  }

  private getDayEvents(): DayViewEvent[] {
    if (!this.events) return [];

    const { events } = getDayView<Event>({ // Using date-fns-timezone or similar for date calculations
      events: this.events,
      viewDate: this.viewDate,
      hourSegments: 2,
      dayStart: { hour: 0, minute: 0 },
      dayEnd: { hour: 23, minute: 59 },
    });

    return events.map((dayViewEvent) => {
      return {
        ...dayViewEvent,
        startsAt: dayViewEvent.event.start,
        endsAt: dayViewEvent.event.end
      };
    });
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
}
