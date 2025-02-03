import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventFormComponent } from './event-form/event-form.component';
import { MaterialModule } from '../material.module'; // Import MaterialModule for MatDialog, MatFormField, etc.
import { ReactiveFormsModule } from '@angular/forms';
import { MatDatetimepickerModule, MatNativeDateModule } from '@angular/material-date-adapter'; // Ensure these are in material.module

/**
 * Shared Module for reusable components and modules across the application.
 * Currently contains the EventFormComponent used in multiple contexts.
 */
@NgModule({
  declarations: [
    EventFormComponent // Declare EventFormComponent
  ],
  imports: [
    CommonModule,
    MaterialModule, // Include MaterialModule
    ReactiveFormsModule,
    MatDatetimepickerModule, // Include MatDatetimepickerModule
    MatNativeDateModule      // Include MatNativeDateModule
  ],
  exports: [
    EventFormComponent // Export EventFormComponent to be used by other modules (like SchedulerModule/AppModule)
  ]
})
export class SharedModule { }
