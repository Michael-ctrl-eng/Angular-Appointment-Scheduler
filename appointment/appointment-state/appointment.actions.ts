import { createAction, props } from '@ngrx/store';
import { Appointment } from '../../shared/models/appointment.model';

// Load Appointments Actions
export const loadAppointments = createAction('[Appointment] Load Appointments');
export const loadAppointmentsSuccess = createAction(
  '[Appointment] Load Appointments Success',
  props<{ appointments: Appointment[] }>()
);
export const loadAppointmentsFailure = createAction(
  '[Appointment] Load Appointments Failure',
  props<{ error: any }>()
);

// Create Appointment Actions
export const createAppointment = createAction(
  '[Appointment] Create Appointment',
  props<{ appointment: Appointment }>()
);
export const createAppointmentSuccess = createAction(
  '[Appointment] Create Appointment Success',
  props<{ appointment: Appointment }>()
);
export const createAppointmentFailure = createAction(
  '[Appointment] Create Appointment Failure',
  props<{ error: any }>()
);

// Update Appointment Actions
export const updateAppointment = createAction(
  '[Appointment] Update Appointment',
  props<{ appointment: Appointment }>()
);
export const updateAppointmentSuccess = createAction(
  '[Appointment] Update Appointment Success',
  props<{ appointment: Appointment }>()
);
export const updateAppointmentFailure = createAction(
  '[Appointment] Update Appointment Failure',
  props<{ error: any }>()
);

// Delete Appointment Actions
export const deleteAppointment = createAction(
  '[Appointment] Delete Appointment',
  props<{ appointmentId: string }>()
);
export const deleteAppointmentSuccess = createAction(
  '[Appointment] Delete Appointment Success',
  props<{ appointmentId: string }>()
);
export const deleteAppointmentFailure = createAction(
  '[Appointment] Delete Appointment Failure',
  props<{ error: any }>()
);
