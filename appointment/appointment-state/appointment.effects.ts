import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of, throwError } from 'rxjs';
import { switchMap, map, catchError, tap, retry, delay, mergeMap, retryWhen } from 'rxjs/operators'; // Import retryWhen, mergeMap
import * as AppointmentActions from './appointment.actions';
import { AppointmentService } from '../appointment.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class AppointmentEffects {

  loadAppointments$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppointmentActions.loadAppointments),
      switchMap(() =>
        this.appointmentService.getAppointments().pipe(
          map(appointments => AppointmentActions.loadAppointmentsSuccess({ appointments })),
          catchError(error => of(AppointmentActions.loadAppointmentsFailure({ error })))
        )
      )
    )
  );

  createAppointment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppointmentActions.createAppointment),
      switchMap(({ appointment }) =>
        this.appointmentService.createAppointment(appointment).pipe(
          map(createdAppointment => AppointmentActions.createAppointmentSuccess({ appointment: createdAppointment })),
          catchError(error => of(AppointmentActions.createAppointmentFailure({ error })))
        )
      )
    )
  );

  updateAppointment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppointmentActions.updateAppointment),
      switchMap(({ appointment }) =>
        this.appointmentService.updateAppointment(appointment).pipe(
          map(updatedAppointment => AppointmentActions.updateAppointmentSuccess({ appointment: updatedAppointment })),
          catchError(error => of(AppointmentActions.updateAppointmentFailure({ error })))
        )
      )
    )
  );

  deleteAppointment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppointmentActions.deleteAppointment),
      mergeMap(({ appointmentId }) => // Use mergeMap to allow multiple delete requests concurrently if needed
        this.appointmentService.deleteAppointment(appointmentId).pipe(
          // Enhanced retry with retryWhen and exponential backoff
          retryWhen(errors =>
            errors.pipe(
              delay(1000), // Wait 1 second before retrying
              mergeMap((error, i) => {
                if (i >= 2) { // Retry max 2 times
                  return throwError(() => error); // Stop retrying after 2 attempts
                }
                console.warn('Retrying appointment deletion...');
                return of(error); // Retry
              })
            )
          ),
          tap(() => this.snackBar.open('Appointment deleted successfully', 'Dismiss', { duration: 3000 })),
          map(() => AppointmentActions.deleteAppointmentSuccess({ appointmentId })),
          catchError(error => {
            // GlobalErrorHandlerService will handle the error, no need to dispatch failure action here anymore
            // We can still show a specific snackbar message if needed
            this.snackBar.open('Error deleting appointment. Please check console for details.', 'Dismiss', { duration: 5000 });
            return of(AppointmentActions.deleteAppointmentFailure({ error })); // Still dispatch failure for NgRx state update if needed
          })
        )
      )
    )
  );

  // Global error handling effect is removed as GlobalErrorHandlerService now handles errors globally

  constructor(
    private actions$: Actions,
    private appointmentService: AppointmentService,
    private snackBar: MatSnackBar
  ) { }
}
