import { Injectable } from '@angular/core';
import { ValidatorFn, AbstractControl, ValidationErrors, AsyncValidatorFn } from '@angular/forms';
import { Observable, of, timer, catchError, map, switchMap } from 'rxjs';
import { AppointmentService } from '../../appointment/appointment.service'; // Import AppointmentService

@Injectable({
  providedIn: 'root'
})
export class CustomValidatorsService {

  constructor(private appointmentService: AppointmentService) { } // Inject AppointmentService

  validDateTimeRange(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const startTimeControl = control.get('startTime');
      const endTimeControl = control.get('endTime');

      if (startTimeControl && endTimeControl) {
        const startTime = startTimeControl.value;
        const endTime = endTimeControl.value;

        if (startTime && endTime && new Date(startTime) >= new Date(endTime)) {
          return { validDateTimeRange: true };
        }
      }
      return null;
    };
  }

  // Example of Async Validator (simulated resource availability check)
  asyncResourceAvailable(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const resourceId = control.value;
      const startTimeControl = control.parent?.get('startTime');
      const endTimeControl = control.parent?.get('endTime');

      if (!resourceId || !startTimeControl?.value || !endTimeControl?.value) {
        return of(null); // No validation needed if resource or times are not selected
      }

      const startTime = new Date(startTimeControl.value);
      const endTime = new Date(endTimeControl.value);
      const appointmentIdControl = control.parent?.get('id'); // Get appointment ID for edit case
      const appointmentId = appointmentIdControl?.value;


      return this.appointmentService.checkResourceAvailability(resourceId, startTime, endTime, appointmentId).pipe( // Pass appointmentId
        map(response => response.isAvailable ? null : { asyncResourceAvailable: true }),
        catchError(() => of({ asyncResourceAvailable: true })) // Handle API errors as unavailable
      );
    };
  }


  // ... You can add more custom validators here ...

}
