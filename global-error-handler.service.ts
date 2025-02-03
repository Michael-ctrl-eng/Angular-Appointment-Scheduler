import { Injectable, ErrorHandler, Injector } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { NotificationService } from './notification.service'; // Assuming you have a notification service for user messages
import { LogService } from './log.service'; // Assuming you have a logging service

@Injectable()
export class GlobalErrorHandlerService implements ErrorHandler {

  constructor(private injector: Injector) { } // Injector to avoid circular dependencies

  handleError(error: Error | HttpErrorResponse): void {
    const notificationService = this.injector.get(NotificationService); // Get services using Injector to avoid constructor injection issues
    const logService = this.injector.get(LogService);
    const router = this.injector.get(Router);

    if (error instanceof HttpErrorResponse) {
      // Server-side or client-side error (HTTP error)
      this.handleHttpError(error, notificationService, logService);
    } else {
      // Client-side error (JavaScript error, Angular error, etc.)
      this.handleClientError(error, notificationService, logService, router);
    }

    console.error('Global Error Handler caught an error:', error); // Still log to console for development
  }

  private handleHttpError(error: HttpErrorResponse, notificationService: NotificationService, logService: LogService): void {
    logService.error('HTTP Error', error); // Log detailed error to your logging service

    let errorMessage = 'An unexpected error occurred. Please try again later.'; // Default message
    if (!navigator.onLine) {
      errorMessage = 'No Internet Connection';
    } else if (error.status === 404) {
      errorMessage = 'Resource not found on the server.';
    } else if (error.status >= 500) {
      errorMessage = 'Server error. Please try again later.';
    } else if (error.error instanceof ErrorEvent) { // Client-side network error within HTTP
      errorMessage = `Network error: ${error.error.message}`;
    } else if (typeof error.error === 'string') {
      errorMessage = error.error; // Assume server sent a user-friendly error message in string format
    } else if (error.message) {
      errorMessage = error.message; // Use generic error message if available
    }

    notificationService.error(errorMessage, 'Error'); // Show user-friendly error notification
  }

  private handleClientError(error: Error, notificationService: NotificationService, logService: LogService, router: Router): void {
    logService.error('Client Error', error); // Log detailed client error

    // Consider reporting client-side errors to an error tracking service (e.g., Sentry, Firebase Crashlytics)
    // Example (if using Sentry):
    // import * as Sentry from '@sentry/angular';
    // Sentry.captureException(error);

    notificationService.error('An unexpected client-side error occurred.', 'Error'); // Generic client error message

    // Optionally, redirect to an error page for client-side errors
    // router.navigate(['/error'], { queryParams: { message: 'Client-side error' } });
  }
}
