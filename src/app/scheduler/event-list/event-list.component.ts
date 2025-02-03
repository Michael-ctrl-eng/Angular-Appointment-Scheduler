import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { Event } from '../../event.model'; // Adjusted path
import { ViewType } from '../scheduler-toolbar/scheduler-toolbar.component'; // Adjusted path
import { DatePipe } from '@angular/common';

/**
 * Component to display a list of events in the scheduler views.
 * Uses OnPush change detection for performance and ARIA attributes for accessibility.
 */
@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush // Enable OnPush change detection for performance
})
export class EventListComponent {
  /** Input: Array of events to display in the list. */
  @Input() events: Event[] | null = [];
  /** Input: Current view type (e.g., 'day', 'week', 'month'). */
  @Input() view: ViewType = 'month';
  /** Input: Currently selected date for context. */
  @Input() selectedDate!: Date;
  /** Output: Event emitted when an event item is clicked (for editing). */
  @Output() eventClicked = new EventEmitter<Event>();
  /** Output: Event emitted when the 'add event' button is clicked. */
  @Output() addEventClicked = new EventEmitter<void>();
  /** Output: Event emitted when an event's delete button is clicked. */
  @Output() deleteEvent = new EventEmitter<Event>(); // Output for delete event action

  constructor(private datePipe: DatePipe) { }

  /**
   * Handles click event on an event item and emits the 'eventClicked' event.
   * @param event The Event object associated with the clicked item.
   */
  onEventClick(event: Event): void {
    this.eventClicked.emit(event); // Emit eventClicked event with the clicked event data
  }

  /**
   * Handles click event on the 'Add Event' button and emits the 'addEventClicked' event.
   */
  onAddEventClick(): void {
    this.addEventClicked.emit(); // Emit addEventClicked event
  }

  /**
   * Handles click event on an event's delete button and emits the 'deleteEvent' event.
   * Also includes accessibility focus management after deletion.
   * @param event The Event object to be deleted.
   * @param eventElement The HTMLElement of the event item (for focus management).
   * @param eventList The HTMLElement of the event list container (for focus management).
   */
  onDeleteEventClick(event: Event, eventElement: HTMLElement, eventList: HTMLElement): void {
    this.deleteEvent.emit(event); // Emit deleteEvent event with the event to be deleted
    // Focus the event list container after deletion to maintain accessibility, especially for keyboard navigation.
    setTimeout(() => { // Use setTimeout to ensure DOM update completes before focusing
      eventList.focus(); // Set focus back to the event list container for better UX
    }, 0);
  }

  /**
   * Gets the style for an event item based on its properties (customize as needed).
   * @param event The Event object.
   * @returns Style object for inline styling of the event item.
   */
  getEventStyle(event: Event): any {
    return {
      'background-color': '#e0f7fa', // Light blue background example
      'border-left': '3px solid #00bcd4', // Accent border example
      'padding': '5px',
      'margin-bottom': '5px',
      'border-radius': '3px',
      'cursor': 'pointer',
      'display': 'block' // Ensure block display for ARIA gridcell role
    };
  }

  /**
   * Formats the event time range for display in the event list.
   * @param event The Event object with start and end dates.
   * @returns Formatted time string (e.g., "10:00 AM - 11:30 AM").
   */
  formatEventTime(event: Event): string {
    const startTime = this.datePipe.transform(event.start, 'shortTime'); // Format start time using DatePipe
    const endTime = this.datePipe.transform(event.end, 'shortTime');     // Format end time using DatePipe
    return `${startTime} - ${endTime}`; // Return formatted time range string
  }

  /**
   * TrackBy function for ngFor to optimize rendering performance by event ID.
   * @param index Index of the item in the array.
   * @param event The Event object.
   * @returns Unique event ID for tracking changes.
   */
  trackByEvents(index: number, event: Event): number | undefined { // Added trackBy function
    return event.id; // Track events by their unique IDs for performance optimization
  }
}
