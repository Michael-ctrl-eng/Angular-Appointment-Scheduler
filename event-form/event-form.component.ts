// src/shared/event-form/event-form.component.ts
import { Component, Inject, Output, EventEmitter, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Event } from '../../event.model';
import { RRule } from 'rrule'; // Import RRule

@Component({ /* ... */ })
export class EventFormComponent implements OnInit {
    eventForm!: FormGroup;
    @Output() eventSaved = new EventEmitter<Event>();
    isRecurringControlVisible = false; // Control visibility of recurrence section


    ngOnInit(): void {
        this.eventForm = this.formBuilder.group({
            // ... (existing form controls - title, start, end, description)
            isRecurring: [this.data.event?.isRecurring || false], // **Add isRecurring control**
            recurrenceRule: [this.data.event?.recurrenceRule || '', ] // **Add recurrenceRule control, initially empty**
        }, { validators: this.dateRangeValidator });

        this.eventForm.get('isRecurring').valueChanges.subscribe(value => { // Control visibility based on isRecurring value
            this.isRecurringControlVisible = value; // Show/hide recurrence rule input
            const recurrenceRuleControl = this.eventForm.get('recurrenceRule');
            if (value) {
                recurrenceRuleControl.setValidators(Validators.required); // Conditionally require recurrenceRule
            } else {
                recurrenceRuleControl.clearValidators(); // Remove requirement when not recurring
            }
            recurrenceRuleControl.updateValueAndValidity(); // Update validation status
        });
    }

    onSave(): void {
        if (this.eventForm.valid) {
            const newEvent: Event = {
                ...this.data.event,
                ...this.eventForm.value,
                isRecurring: this.eventForm.get('isRecurring').value, // Get isRecurring value
                recurrenceRule: this.eventForm.get('recurrenceRule').value // Get recurrenceRule value
            };
            this.eventSaved.emit(newEvent);
            this.dialogRef.close(newEvent);
        }
    }

    // ... (rest of EventFormComponent code - dateRangeValidator, onCancel)
}
