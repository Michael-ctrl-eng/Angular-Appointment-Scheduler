import { Component, Inject, Output, EventEmitter, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Event } from '../../event.model'; // Adjusted path

/**
 * Reusable Event Form Component for adding and editing events.
 * Used within a MatDialog for modal event creation and modification.
 */
@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.scss']
})
export class EventFormComponent implements OnInit {
  eventForm!: FormGroup;
  @Output() eventSaved = new EventEmitter<Event>(); // Output event to notify parent component when event is saved

  constructor(
    public dialogRef: MatDialogRef<EventFormComponent>, // Reference to the MatDialog
    @Inject(MAT_DIALOG_DATA) public data: { event: Event | null }, // Inject dialog data (event to edit or null for new event)
    private formBuilder: FormBuilder // FormBuilder for creating reactive forms
  ) { }

  ngOnInit(): void {
    this.eventForm = this.formBuilder.group({ // Initialize event form using FormBuilder
      title: [this.data.event?.title || '', Validators.required], // Title, required validator
      start: [this.data.event?.start || null, Validators.required], // Start date, required validator
      end: [this.data.event?.end || null, Validators.required],   // End date, required validator
      description: [this.data.event?.description || '']        // Description, no validation
    }, { validators: this.dateRangeValidator }); // Add custom date range validator to the form group
  }

  /**
   * Custom validator function to ensure end date is after start date.
   * @param group FormGroup containing 'start' and 'end' date controls.
   * @returns Validation error if end date is not after start date, otherwise null.
   * @private
   */
  private dateRangeValidator(group: FormGroup) {
    const start = group.get('start')?.value; // Get start date value from form control
    const end = group.get('end')?.value;   // Get end date value from form control
    return start && end && start < end ? null : { dateRange: true }; // Return error if range is invalid
  }

  /**
   * Handles form submission when user clicks 'Save'.
   * Emits the eventSaved event with the form data and closes the dialog.
   */
  onSave(): void {
    if (this.eventForm.valid) { // Check if the form is valid
      const newEvent: Event = {
        ...this.data.event,       // Preserve existing event properties if editing
        ...this.eventForm.value  // Merge form values into the event object
      };
      this.eventSaved.emit(newEvent); // Emit eventSaved event with the new event data
      this.dialogRef.close(newEvent);  // Close the dialog, returning the new event as result
    }
  }

  /**
   * Handles cancellation of the form by closing the dialog.
   */
  onCancel(): void {
    this.dialogRef.close(null); // Close the dialog, returning null to indicate cancellation
  }
}
