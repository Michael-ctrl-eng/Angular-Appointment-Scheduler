// Create a new component: appointment-display.component.ts - "Dumb" Component
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { Appointment } from '../../models/appointment.model'; // Correct model path
import { CalendarOptions } from '@fullcalendar/core';

@Component({
    selector: 'app-appointment-display',
    templateUrl: './appointment-display.component.html',
    styleUrls: ['./appointment-display.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush // Example: OnPush change detection for performance if input data changes immutably
})
export class AppointmentDisplayComponent {
    @Input() appointments: Appointment[] = [];
    @Input() calendarOptions: CalendarOptions = {}; // Make sure to import CalendarOptions

    constructor() { }
}
