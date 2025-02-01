import { createReducer, on } from '@ngrx/store';
import { EntityState, createEntityAdapter } from '@ngrx/entity';
import * as AppointmentActions from './appointment.actions';
import { Appointment } from '../../shared/models/appointment.model';

// Entity Adapter for efficient state management
export const appointmentAdapter = createEntityAdapter<Appointment>();

// Interface for the state, extending EntityState
export interface AppointmentState extends EntityState<Appointment> {
  loading: boolean;
  error: any;
}

// Initial state using the adapter's getInitialState method
export const initialState: AppointmentState = appointmentAdapter.getInitialState({
  loading: false,
  error: null
});

// Reducer function
export const appointmentReducer = createReducer(
  initialState,
  // Load Appointments
  on(AppointmentActions.loadAppointments, (state) => ({ ...state, loading: true, error: null })),
  on(AppointmentActions.loadAppointmentsSuccess, (state, { appointments }) =>
    appointmentAdapter.setAll(appointments, { ...state, loading: false }) // Use setAll for initial load
  ),
  on(AppointmentActions.loadAppointmentsFailure, (state, { error }) => ({ ...state, loading: false, error })),

  // Create Appointment
  on(AppointmentActions.createAppointment, (state) => ({ ...state, loading: true, error: null })),
  on(AppointmentActions.createAppointmentSuccess, (state, { appointment }) =>
    appointmentAdapter.addOne(appointment, { ...state, loading: false }) // Use addOne for single entity addition
  ),
  on(AppointmentActions.createAppointmentFailure, (state, { error }) => ({ ...state, loading: false, error })),

  // Update Appointment
  on(AppointmentActions.updateAppointment, (state) => ({ ...state, loading: true, error: null })),
  on(AppointmentActions.updateAppointmentSuccess, (state, { appointment }) =>
    appointmentAdapter.updateOne({ id: appointment.id, changes: appointment }, { ...state, loading: false }) // Use updateOne for entity update
  ),
  on(AppointmentActions.updateAppointmentFailure, (state, { error }) => ({ ...state, loading: false, error })),

  // Delete Appointment
  on(AppointmentActions.deleteAppointment, (state) => ({ ...state, loading: true, error: null })),
  on(AppointmentActions.deleteAppointmentSuccess, (state, { appointmentId }) =>
    appointmentAdapter.removeOne(appointmentId, { ...state, loading: false }) // Use removeOne for entity deletion
  ),
  on(AppointmentActions.deleteAppointmentFailure, (state, { error }) => ({ ...state, loading: false, error }))
);
