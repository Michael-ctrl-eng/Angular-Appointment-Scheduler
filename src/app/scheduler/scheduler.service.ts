import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap, throwError } from 'rxjs'; // Import throwError
import { Event } from '../event.model'; // Adjusted path
import { RestApiService } from '../core/rest-api.service'; // Adjusted path to RestApiService

/**
 * Scheduler Service for managing events and communicating with the backend API.
 * Acts as a central data service for the Scheduler component and related views.
 */
@Injectable({
  providedIn: 'root'
})
export class SchedulerService {
  private eventsSubject = new BehaviorSubject<Event[]>([]); // BehaviorSubject to hold and emit event data
  events$ = this.eventsSubject.asObservable(); // Observable stream of events for components to subscribe to

  constructor(private restApiService: RestApiService) { // Inject RestApiService for API interactions
    this.loadEvents(); // Load initial events when the service is created
  }

  /**
   * Loads events from the backend API and updates the eventsSubject.
   */
  loadEvents(): void {
    this.restApiService.getEvents().subscribe( // Use RestApiService to fetch events from API
      events => {
        this.eventsSubject.next(events); // Update the BehaviorSubject with fetched events, emitting to subscribers
      },
      error => {
        // Error already handled by GlobalErrorHandler - just log here if needed for service-specific context
        console.error('Error loading events in SchedulerService', error);
        // No need to re-handle, GlobalErrorHandler shows user-friendly message.
      }
    );
  }

  /**
   * Adds a new event to the backend API and updates the local state.
   * @param event The Event object to add.
   * @returns Observable of the newly created Event from the API.
   */
  addEvent(event: Event): Observable<Event> {
    return this.restApiService.addEvent(event).pipe( // Call RestApiService to add event to API
      tap(newEvent => { // On successful API add, update local state optimistically
        const currentEvents = this.eventsSubject.value; // Get current events from BehaviorSubject
        this.eventsSubject.next([...currentEvents, newEvent]); // Append new event and emit updated list
      })
    );
  }

  /**
   * Updates an existing event in the backend API and updates the local state.
   * @param event The Event object to update. Must have an ID.
   * @returns Observable of the updated Event from the API.
   */
  updateEvent(event: Event): Observable<Event> {
    if (!event.id) {
      return throwError(() => new Error('Event ID is required for update.')); // Handle case where event ID is missing
    }
    return this.restApiService.updateEvent(event.id, event).pipe( // Call RestApiService to update event in API
      tap(updatedEvent => { // On successful API update, update local state
        const currentEvents = this.eventsSubject.value; // Get current events
        const updatedEvents = currentEvents.map(e => e.id === updatedEvent.id ? updatedEvent : e); // Replace updated event in list
        this.eventsSubject.next(updatedEvents); // Emit updated list
      })
    );
  }

  /**
   * Deletes an event from the backend API and updates the local state.
   * @param eventId The ID of the event to delete.
   * @returns Observable of unknown type (API delete may not return data).
   */
  deleteEvent(eventId: number): Observable<unknown> {
    return this.restApiService.deleteEvent(eventId).pipe( // Call RestApiService to delete event from API
      tap(() => { // On successful API delete, update local state
        const currentEvents = this.eventsSubject.value; // Get current events
        const filteredEvents = currentEvents.filter(event => event.id !== eventId); // Filter out deleted event
        this.eventsSubject.next(filteredEvents); // Emit updated list
      })
    );
  }

  // ... (rest of the service logic - date calculations, view-specific logic if any - can remain in this service)
}
