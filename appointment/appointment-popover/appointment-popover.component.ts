import { Component, Input, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { CalendarEvent } from 'angular-calendar';
import { Appointment } from '../../shared/models/appointment.model';
import { formatDate } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent, ConfirmationDialogData } from '../../shared/confirmation-dialog/confirmation-dialog.component';
import { AppointmentService } from '../appointment.service';
import { Store } from '@ngrx/store';
import * as AppointmentActions from '../appointment-state/appointment.actions';
import { AppointmentEditDialogComponent } from '../appointment-edit-dialog/appointment-edit-dialog.component';

@Component({
  selector: 'app-appointment-popover',
  templateUrl: './appointment-popover.component.html',
  styleUrls: ['./appointment-popover.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.ShadowDom
})
export class AppointmentPopoverComponent {
  @Input() event!: CalendarEvent;

  constructor(
    public dialog: MatDialog,
    private appointmentService: AppointmentService,
    private store: Store
  ) {}

  get appointment(): Appointment | undefined {
    return this.event.meta?.appointment;
  }

  formatDateTimeRange(): string {
    if (!this.event.start || !this.event.end) return 'N/A';
    const startDate = formatDate(this.event.start, 'MMM d, y, h:mm a', 'en-US');
    const endDate = formatDate(this.event.end, 'h:mm a', 'en-US'); // Just end time
    return `${startDate} - ${endDate}`;
  }

  onDeleteAppointment(): void {
    const dialogData: ConfirmationDialogData = {
      title: 'Confirm Delete',
      message: `Are you sure you want to delete the appointment: "${this.event.title}"?`
    };

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteAppointment();
      }
    });
  }

  private deleteAppointment(): void {
    if (this.appointment?.id) {
      this.store.dispatch(AppointmentActions.deleteAppointment({ appointmentId: this.appointment.id }));
    }
  }

  onEditAppointment(): void {
    if (this.appointment) {
      const dialogRef = this.dialog.open(AppointmentEditDialogComponent, {
        width: '600px',
        data: { appointment: this.appointment } // Pass the appointment data for editing
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          // Handle updated appointment (if needed, update is handled by dialog)
          console.log('Appointment updated in dialog:', result);
        }
      });
    }
  }
}
