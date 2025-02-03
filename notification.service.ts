
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private snackBar: MatSnackBar) { }

  success(message: string, action?: string): void {
    this.snackBar.open(message, action, {
      duration: 3000, // Adjust duration as needed
      panelClass: ['success-snackbar'] // Optional CSS class for styling
    });
  }

  error(message: string, action?: string): void {
    this.snackBar.open(message, action, {
      duration: 5000, // Error messages usually displayed longer
      panelClass: ['error-snackbar'] // Optional CSS class for styling
    });
  }

  info(message: string, action?: string): void {
    this.snackBar.open(message, action, {
      duration: 3000,
      panelClass: ['info-snackbar']
    });
  }
}
