import { Component, Inject, OnInit, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DynamicFormRenderingService } from '../../shared/services/dynamic-form-rendering.service';
import { Store } from '@ngrx/store';
import * as AppointmentActions from '../appointment-state/appointment.actions';
import { Appointment } from '../../shared/models/appointment.model';

@Component({
  selector: 'app-appointment-edit-dialog',
  templateUrl: './appointment-edit-dialog.component.html',
  styleUrls: ['./appointment-edit-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.ShadowDom
})
export class AppointmentEditDialogComponent implements OnInit {
  formGroup!: FormGroup;
  formSchema: any;
  schemaPath = 'assets/schemas/appointment-edit-form-schema.json'; // Path to your schema
  isEditMode: boolean = false; // Flag to determine if it's edit or create
  dialogTitle: string = 'Create Appointment';

  constructor(
    public dialogRef: MatDialogRef<AppointmentEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, // Data can be appointment for edit or date for create
    private fb: FormBuilder,
    private dynamicFormService: DynamicFormRenderingService,
    private store: Store
  ) { }

  ngOnInit(): void {
    this.isEditMode = !!this.data.appointment; // Check if appointment data is passed for edit mode
    this.dialogTitle = this.isEditMode ? 'Edit Appointment' : 'Create Appointment';
    this.loadForm();
  }

  loadForm(): void {
    this.dynamicFormService.loadFormSchema(this.schemaPath).subscribe(schema => {
      if (schema) {
        this.formSchema = schema;
        this.formGroup = this.dynamicFormService.generateFormGroup(schema);
        if (this.isEditMode && this.data.appointment) {
          this.formGroup.patchValue(this.data.appointment); // Populate form with appointment data for editing
        } else if (!this.isEditMode && this.data.date) {
          // Initialize startTime and endTime for create mode based on clicked date (optional)
          const startDate = new Date(this.data.date);
          const endDate = new Date(startDate);
          endDate.setHours(endDate.getHours() + 1); // Default to 1 hour duration
          this.formGroup.patchValue({ startTime: startDate, endTime: endDate });
        }
        console.log('Dynamic FormGroup generated:', this.formGroup);
      } else {
        console.error('Failed to load form schema.');
      }
    });
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.formGroup.valid) {
      const appointmentData: Appointment = this.formGroup.value;
      if (this.isEditMode && this.data.appointment?.id) {
        const updatedAppointment: Appointment = { ...appointmentData, id: this.data.appointment.id };
        this.store.dispatch(AppointmentActions.updateAppointment({ appointment: updatedAppointment }));
      } else {
        this.store.dispatch(AppointmentActions.createAppointment({ appointment: appointmentData }));
      }
      this.dialogRef.close(appointmentData); // Close dialog and optionally return data
    } else {
      console.log('Form is invalid.');
      // Optionally trigger form validation display here
    }
  }

  isSectionVisible(sectionSchema: any): boolean {
    if (!sectionSchema.condition) {
      return true; // Section is always visible if no condition
    }
    const condition = sectionSchema.condition;
    const controllingControl = this.formGroup.get(condition.field);
    if (controllingControl) {
      return condition.values.includes(controllingControl.value);
    }
    return false; // Hide section if controlling field not found or condition not met
  }
}
