import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AppointmentState, appointmentAdapter } from './appointment.reducer';

// Feature selector
export const selectAppointmentState = createFeatureSelector<AppointmentState>('appointments');

// Selectors using the entity adapter
export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = appointmentAdapter.getSelectors(selectAppointmentState);

// Memoized selector to get all appointments
export const selectAllAppointments = selectAll;

// Selector to get appointment entities (dictionary of appointments by ID)
export const selectAppointmentEntities = selectEntities;

// Selector to check if appointments are loading
export const selectAppointmentsLoading = createSelector(
  selectAppointmentState,
  (state: AppointmentState) => state.loading
);

// Selector to get the error state
export const selectAppointmentsError = createSelector(
  selectAppointmentState,
  (state: AppointmentState) => state.error
);

// Example of a derived selector (e.g., filter appointments by type - could be more complex)
export const selectConsultationAppointments = createSelector(
  selectAllAppointments,
  (appointments: any) => appointments.filter((appointment: any) => appointment.appointmentType === 'consultation') // Type 'any' here for example, adjust as needed
);
