// Inside shared/event-form/event-form.component.ts
import { Component, Inject, Output, EventEmitter, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Event } from '../../event.model';

@Component({ /* ... */ })
export class EventFormComponent implements OnInit {
  eventForm!: FormGroup;
  @Output() eventSaved = new EventEmitter<Event>();

  constructor(
    public dialogRef: MatDialogRef<EventFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { event: Event | null, suggestedStartDate?: Date }, // Add suggestedStartDate to data
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    const startDate = this.data.event?.start || this.data.suggestedStartDate || null; // Use suggestedStartDate if available for new event
    const endDate = this.data.event?.end || this.data.suggestedStartDate || null;    // Set end date same as start for new event if suggested
    this.eventForm = this.formBuilder.group({
      title: [this.data.event?.title || '', Validators.required],
      start: [startDate, Validators.required],
      end: [endDate, Validators.required],
      description: [this.data.event?.description || '']
    }, { validators: this.dateRangeValidator });
  }

  // ... (rest of the component: dateRangeValidator, onSave, onCancel) ...
}
