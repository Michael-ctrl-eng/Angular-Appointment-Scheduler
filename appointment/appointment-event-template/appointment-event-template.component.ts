import { Component, Input, TemplateRef, ViewChild, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { CalendarEvent } from 'angular-calendar';
import { Appointment } from '../../shared/models/appointment.model';

@Component({
  selector: 'app-appointment-event-template',
  template: `
    <ng-template #defaultTemplate>
      <div class="event-wrapper" [style.backgroundColor]="event.color?.secondary" [style.borderColor]="event.color?.primary">
        <div class="event-content">
          <div class="event-title">{{ event.title }}</div>
          <div class="event-details">
            <span class="event-time">{{ formatTime(event.start) }} - {{ formatTime(event.end) }}</span>
            <span *ngIf="appointment?.appointmentType" class="event-type">({{ appointment?.appointmentType }})</span>
          </div>
          <div *ngIf="appointment?.attendees?.length > 0" class="event-attendees">
            Attendees: <span *ngFor="let attendee of getAttendeeSnippets()">{{ attendee }}</span><span *ngIf="getAttendeeSnippets().length < appointment?.attendees?.length">...</span>
          </div>
          <mat-icon *ngIf="appointment?.status === 'confirmed'" class="status-icon confirmed">check_circle</mat-icon>
          <mat-icon *ngIf="appointment?.status === 'pending'" class="status-icon pending">schedule</mat-icon>
          <mat-icon *ngIf="appointment?.status === 'cancelled'" class="status-icon cancelled">cancel</mat-icon>
        </div>
      </div>
    </ng-template>
    <ng-container *ngIf="customTemplate; else defaultTemplate">
      <ng-container *ngTemplateOutlet="customTemplate; context: { event: event }"></ng-container>
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.ShadowDom,
  styles: [`
    .event-wrapper {
      border-width: 2px;
      border-style: solid;
      border-radius: 4px;
      padding: 4px;
      margin-bottom: 2px;
      color: #333; /* Adjust text color as needed */
      overflow: hidden; /* Prevent content overflow */
      text-overflow: ellipsis; /* Handle long text */
      white-space: nowrap; /* Prevent text wrapping */
      display: block; /* Ensure block display for proper sizing */
    }

    .event-content {
      display: flex;
      flex-direction: column;
    }

    .event-title {
      font-weight: bold;
      font-size: 0.9em;
      margin-bottom: 2px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .event-details {
      font-size: 0.8em;
      color: #666; /* Adjust time/details color */
      display: flex;
      align-items: center; /* Vertically align time and type */
    }

    .event-time {
      margin-right: 4px;
    }

    .event-type {
      font-style: italic;
    }

    .event-attendees {
      font-size: 0.75em;
      color: #777;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .status-icon {
      font-size: 16px; /* Adjust icon size */
      width: 16px;
      height: 16px;
      margin-left: auto; /* Push icon to the right */
      margin-top: -16px; /* Align icon to top right */
      float: right; /* Align icon to top right */
      color: grey; /* Default icon color */
    }

    .status-icon.confirmed {
      color: green;
    }

    .status-icon.pending {
      color: orange;
    }

    .status-icon.cancelled {
      color: red;
    }
  `]
})
export class AppointmentEventTemplateComponent {
  @Input() event!: CalendarEvent;
  @Input() customTemplate?: TemplateRef<any>;
  @ViewChild('defaultTemplate', { static: true }) defaultTemplate!: TemplateRef<any>;

  get appointment(): Appointment | undefined {
    return this.event.meta?.appointment;
  }

  formatTime(date: Date): string {
    return new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }).format(date);
  }

  getAttendeeSnippets(): string[] {
    return this.appointment?.attendees?.slice(0, 2) || []; // Get first 2 attendees for snippet
  }
}
