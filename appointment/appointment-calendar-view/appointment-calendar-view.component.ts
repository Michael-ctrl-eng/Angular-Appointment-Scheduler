import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CalendarView, CalendarEvent } from 'angular-calendar';
import { Subject, Observable } from 'rxjs';
import { Appointment } from '../../shared/models/appointment.model';
import { AppointmentService } from '../appointment.service';
import { takeUntil, map } from 'rxjs/operators';
import { colors } from './event-colors';
import { AppointmentEventTemplateComponent } from '../appointment-event-template/appointment-event-template.component';
import { OverlayService } from '../overlay.service';
import { Store } from '@ngrx/store';
import * as AppointmentActions from '../appointment-state/appointment.actions';
import * as AppointmentSelectors from '../appointment-state/appointment.selectors';
import { MatDialog } from '@angular/material/dialog';
import { AppointmentEditDialogComponent } from '../appointment-edit-dialog/appointment-edit-dialog.component';
import { RRule } from 'rrule'; // Import RRule
import { addMonths } from 'date-fns'; // Import date-fns function

@Component({
  selector: 'app-appointment-calendar-view',
  templateUrl: './appointment-calendar-view.component.html',
  styleUrls: ['./appointment-calendar-view.component.scss'],
  providers: [OverlayService]
})
export class AppointmentCalendarViewComponent implements OnInit, OnDestroy {
  view: CalendarView = CalendarView.Month;
  viewDate: Date = new Date();
  events$: Observable<CalendarEvent[]>;
  activeDayIsOpen: boolean = false;
  private ngUnsubscribe = new Subject<void>();
  @ViewChild('calendarContainer', { static: false, read: ElementRef }) calendarContainer!: ElementRef;
  loading$: Observable<boolean>;
  error$: Observable<any>; // Observable for error state

  constructor(
    private appointmentService: AppointmentService,
    private overlayService: OverlayService,
    private store: Store,
    public dialog: MatDialog
  ) {
    this.events$ = this.store.select(AppointmentSelectors.selectAllAppointments)
      .pipe(
        map(appointments => this.processAppointmentsForCalendar(appointments))
      );
    this.loading$ = this.store.select(AppointmentSelectors.selectAppointmentsLoading);
    this.error$ = this.store.select(AppointmentSelectors.selectAppointmentsError); // Select error state
  }

  ngOnInit(): void {
    this.store.dispatch(AppointmentActions.loadAppointments());
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  processAppointmentsForCalendar(appointments: Appointment[]): CalendarEvent[] {
    let calendarEvents: CalendarEvent[] = [];

    appointments.forEach(appointment => {
      if (appointment.isRecurring && appointment.recurrenceRule) {
        try {
          const rrule = RRule.fromString(appointment.recurrenceRule);
          const start = new Date(appointment.startTime);
          const end = new Date(appointment.endTime);
          const duration = end.getTime() - start.getTime(); // Calculate duration

          const now = new Date();
          const futureDate = addMonths(now, 3); // Generate recurring events for next 3 months (adjust as needed)
          const dates = rrule.between(now, futureDate, true); // Get dates within range

          dates.forEach(date => {
            const recurringEventStart = new Date(date);
            const recurringEventEnd = new Date(recurringEventStart.getTime() + duration); // Add duration to start
            calendarEvents.push(this.mapAppointmentToCalendarEvent(appointment, recurringEventStart, recurringEventEnd)); // Pass generated start/end
          });
        } catch (e) {
          console.error('Error parsing RRULE:', appointment.recurrenceRule, e);
          calendarEvents.push(this.mapAppointmentToCalendarEvent(appointment)); // Fallback to single event if RRULE error
        }
      } else {
        calendarEvents.push(this.mapAppointmentToCalendarEvent(appointment)); // Non-recurring event
      }
    });

    return calendarEvents;
  }


  mapAppointmentToCalendarEvent(appointment: Appointment, recurringStart?: Date, recurringEnd?: Date): CalendarEvent {
    const start = recurringStart ? recurringStart : new Date(appointment.startTime);
    const end = recurringEnd ? recurringEnd : new Date(appointment.endTime);

    return {
      id: appointment.id,
      start: start,
      end: end,
      title: appointment.title,
      color: colors.blue,
      allDay: false,
      resizable: {
        beforeStart: true,
        afterEnd: true
      },
      draggable: true,
      meta: {
        appointment: appointment
      }
    };
  }

  dayClicked({ date, events, sourceElement }: { date: Date; events: CalendarEvent[]; sourceElement: HTMLElement }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
    if (events.length > 0 && sourceElement) {
      this.openEventPopover(events[0], sourceElement);
    } else {
      this.openCreateAppointmentDialog(date); // Open create dialog if no event clicked
    }
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: {
    event: CalendarEvent;
    newStart: Date;
    newEnd: Date;
  }): void {
    const updatedAppointment: Appointment = {
      ...event.meta.appointment,
      startTime: newStart,
      endTime: newEnd
    };
    this.store.dispatch(AppointmentActions.updateAppointment({ appointment: updatedAppointment }));
  }

  openEventPopover(event: CalendarEvent, element: HTMLElement): void {
    this.overlayService.openPopover(event, new ElementRef(element));
  }

  openCreateAppointmentDialog(date: Date): void {
    const dialogRef = this.dialog.open(AppointmentEditDialogComponent, {
      width: '600px',
      data: { date: date } // Pass the clicked date to the dialog
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Handle created appointment (if needed, although create is handled by dialog itself now)
        console.log('Appointment created in dialog:', result);
      }
    });
  }
}


function isSameMonth(dateLeft: Date, dateRight: Date): boolean {
  return dateLeft.getMonth() === dateRight.getMonth() && dateLeft.getFullYear() === dateRight.getFullYear();
}

function isSameDay(dateLeft: Date, dateRight: Date): boolean {
  return dateLeft.getDate() === dateRight.getDate() && isSameMonth(dateLeft, dateRight);
}
