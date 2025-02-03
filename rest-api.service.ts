import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Event } from '../event.model'; // Adjusted path
import { environment } from '../../environments/environment'; // Adjusted path

/**
 * Service for handling REST API calls to the backend.
 * Centralizes API interaction and error handling for all backend requests.
 */
@Injectable({
  providedIn: 'root'
})
export class RestApiService {
  private apiUrl = environment.apiUrl; // e.g., 'api' from environment configuration

  constructor(private http: HttpClient) { }

  /**
   * Retrieves all events from the backend API.
   * @returns Observable of Event array.
   */
  getEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.apiUrl}/events`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Adds a new event to the backend API.
   * @param event The Event object to add.
   * @returns Observable of the newly created Event.
   */
  addEvent(event: Event): Observable<Event> {
    return this.http.post<Event>(`${this.apiUrl}/events`, event)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Updates an existing event in the backend API.
   * @param id The ID of the event to update.
   * @param event The updated Event object.
   * @returns Observable of the updated Event.
   */
  updateEvent(id: number, event: Event): Observable<Event> {
    return this.http.put<Event>(`${this.apiUrl}/events/${id}`, event)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Deletes an event from the backend API.
   * @param id The ID of the event to delete.
   * @returns Observable of unknown type (as delete might not return data).
   */
  deleteEvent(id: number): Observable<unknown> {
    return this.http.delete(`${this.apiUrl}/events/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Handles HTTP errors for API requests.
   * Logs the error and rethrows it for global error handling.
   * @param error The HttpErrorResponse.
   * @returns Observable that throws an error.
   * @private
   */
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Backend error
      errorMessage = `Server returned code: ${error.status}, error message is: ${error.error.message}`;
    }
    console.error(errorMessage); // For detailed logging - GlobalErrorHandler will handle user feedback
    return throwError(() => new Error(errorMessage));
  }
}
