import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { appointmentReducer } from './appointment.reducer';
import { AppointmentEffects } from './appointment.effects';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature('appointments', appointmentReducer),
    EffectsModule.forFeature([AppointmentEffects])
  ]
})
export class AppointmentStateModule { }
