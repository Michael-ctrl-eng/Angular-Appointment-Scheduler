import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppointmentRoutingModule } from './appointment-routing.module';
import { AppointmentCalendarViewComponent } from './appointment-calendar-view/appointment-calendar-view.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { DateFnsModule } from 'date-fns';
import { AppointmentPopoverComponent } from './appointment-popover/appointment-popover.component';
import { AppointmentEventTemplateComponent } from './appointment-event-template/appointment-event-template.component';
import { SharedModule } from '../shared/shared.module';
import { OverlayService } from './overlay.service';
import { AppointmentEditDialogComponent } from './appointment-edit-dialog/appointment-edit-dialog.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { appointmentReducer } from './appointment-state/appointment.reducer';
import { AppointmentEffects } from './appointment-state/appointment.effects';
import { AppointmentStateModule } from './appointment-state/appointment-state.module';
import { MatSnackBarModule } from '@angular/material/snack-bar'; // Import MatSnackBarModule

@NgModule({
  declarations: [
    AppointmentCalendarViewComponent,
    AppointmentPopoverComponent,
    AppointmentEventTemplateComponent,
    AppointmentEditDialogComponent
  ],
  imports: [
    CommonModule,
    AppointmentRoutingModule,
    SharedModule,
    DateFnsModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    AppointmentStateModule,
    StoreModule.forFeature('appointments', appointmentReducer),
    EffectsModule.forFeature([AppointmentEffects]),
    MatSnackBarModule // Add MatSnackBarModule import
  ],
  providers: [OverlayService]
})
export class AppointmentModule { }
