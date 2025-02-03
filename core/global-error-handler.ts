import { Injectable, ErrorHandler, Injector } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar'; // Ensure MaterialModule imports MatSnackBar

/**
 * Global Error Handler to catch and handle errors application-wide.
 * Provides user-friendly error messages via MatSnackBar and logs errors to console.
 */
@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

  constructor(private injector: Injector) { }

  /**
   * Handles the error, determines error type (HTTP or client), and provides feedback.
   * @param error The Error or HttpErrorResponse object.
   */
  handleError(error: Error | HttpErrorResponse): void {
    const snackBar = this.injector.get(MatSnackBar); // Inject MatSnackBar dynamically

    if (error instanceof HttpErrorResponse) {
      // Backend or API error
      console.error('HTTP Error:', error);
      snackBar.open(`Backend Error: ${error.message}`, 'Dismiss', { duration: 5000 }); // User-friendly message
    } else {
      // Client-side or application error
      console.error('Client Error:', error);
      snackBar.open(`An application error occurred: ${error.message}`, 'Dismiss', { duration: 5000 }); // User-friendly message
    }
    // Rethrow the error to maintain default error handling behavior and for potential upper-level handlers if needed.
    throw error;
  }
}
