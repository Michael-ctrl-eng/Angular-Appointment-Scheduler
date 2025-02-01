import { Injectable, ErrorHandler, Injector, NgZone } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as AppointmentActions from '../appointment/appointment-state/appointment.actions'; // Import relevant actions

@Injectable()
export class GlobalErrorHandlerService implements ErrorHandler {

  constructor(
    private injector: Injector,
    private zone: NgZone // Inject NgZone
  ) { }

  handleError(error: any): void {
    const snackBar = this.injector.get(MatSnackBar);
    const router = this.injector.get(Router);
    const store = this.injector.get(Store);

    let message = 'An unexpected error occurred.';
    let stackTrace = '';

    if (error instanceof HttpErrorResponse) {
      // Backend or network error
      message = this.getServerErrorMessage(error);
    } else if (error instanceof Error) {
      // Client-side or application error
      message = error.message || message;
      stackTrace = error.stack || '';
    } else {
      // Unknown error
      message = 'An unknown error occurred.';
      stackTrace = 'No stack trace available.';
    }

    console.error('Global Error Handler:', error); // Log the full error

    // Run snackbar and navigation outside Angular zone to avoid change detection issues
    this.zone.run(() => {
      snackBar.open(message, 'Dismiss', {
        duration: 5000,
        panelClass: ['error-snackbar'] // Optional error styling
      });
    });


    // Optionally, you can dispatch an error action to NgRx store for global error state management
    // Example: store.dispatch(AppointmentActions.globalError({ error: message }));

    // Optionally, redirect to an error page for specific errors
    // if (error.status === 401 || error.status === 403) {
    //   this.zone.run(() => router.navigate(['/error', error.status]));
    // }
  }

  private getServerErrorMessage(error: HttpErrorResponse): string {
    if (navigator.onLine === false) {
      return 'No Internet Connection';
    }
    return error.message || 'Server error occurred.'; // Fallback message
  }
}
