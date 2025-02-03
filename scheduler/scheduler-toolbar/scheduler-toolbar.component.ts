import { Component, Output, EventEmitter, Input } from '@angular/core';
import { ViewType } from './scheduler-toolbar.component';
import { addDays, addWeeks, addMonths, subDays, subWeeks, subMonths, startOfToday, format } from 'date-fns'; // Import date-fns functions

@Component({ /* ... */ })
export class SchedulerToolbarComponent {
  @Output() viewChange = new EventEmitter<ViewType>();
  @Output() dateChange = new EventEmitter<Date>();

  @Input() viewDate: Date = new Date(); // Input to receive viewDate from parent

  currentView: ViewType = 'month';
  currentDate: Date = new Date();

  constructor() {
    this.currentDate = this.viewDate; // Initialize currentDate from input viewDate
  }

  setView(view: ViewType): void {
    this.currentView = view;
    this.viewChange.emit(view);
  }

  onViewChangeToDay(): void { this.setView('day'); }
  onViewChangeToWeek(): void { this.setView('week'); }
  onViewChangeToMonth(): void { this.setView('month'); }
  onViewChangeToList(): void { this.setView('list'); }

  onPrev(): void {
    this.changeDate(-1);
  }

  onNext(): void {
    this.changeDate(1);
  }

  onToday(): void {
    this.currentDate = startOfToday();
    this.dateChange.emit(this.currentDate);
  }

  private changeDate(direction: number): void {
    let newDate: Date;
    switch (this.currentView) {
      case 'day':
        newDate = direction > 0 ? addDays(this.currentDate, 1) : subDays(this.currentDate, 1);
        break;
      case 'week':
        newDate = direction > 0 ? addWeeks(this.currentDate, 1) : subWeeks(this.currentDate, 1);
        break;
      case 'month':
        newDate = direction > 0 ? addMonths(this.currentDate, 1) : subMonths(this.currentDate, 1);
        break;
      default: // Default to day navigation if view is not recognized
        newDate = direction > 0 ? addDays(this.currentDate, 1) : subDays(this.currentDate, 1);
    }
    this.currentDate = newDate;
    this.dateChange.emit(this.currentDate);
  }

  get displayDate(): string {
    let formatStr = '';
    switch (this.currentView) {
      case 'day':
        formatStr = 'EEEE, MMMM d';
        break;
      case 'week':
        const weekStart = format(this.currentDate, 'MMMM d');
        const weekEnd = format(addDays(this.currentDate, 6), 'MMMM d'); // Assuming week starts on Sunday/Monday as per locale
        formatStr = `${weekStart} - ${weekEnd}`;
        break;
      case 'month':
        formatStr = 'MMMM yyyy';
        break;
      default:
        formatStr = 'MMMM d, yyyy'; // Default format
    }
    return format(this.currentDate, formatStr);
  }

}
