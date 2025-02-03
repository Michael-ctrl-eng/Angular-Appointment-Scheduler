import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private snackBar: MatSnackBar) { }

  private defaultConfig: MatSnackBarConfig = {
    duration: 3000, // Default duration for notifications
    horizontalPosition: 'end', // Position at the end of the screen
    verticalPosition: 'bottom', // Position at the bottom of the screen
  };

  success(message: string, action?: string, config?: MatSnackBarConfig): void {
    this.show(message, action, {
      ...this.defaultConfig, // Apply default config
      panelClass: ['success-snackbar'], // Custom CSS class for success
      ...config, // Override defaults with provided config
    });
  }

  error(message: string, action?: string, config?: MatSnackBarConfig): void {
    this.show(message, action, {
      ...this.defaultConfig,
      duration: 5000, // Longer duration for errors
      panelClass: ['error-snackbar'], // Custom CSS class for errors
      ...config,
    });
  }

  info(message: string, action?: string, config?: MatSnackBarConfig): void {
    this.show(message, action, {
      ...this.defaultConfig,
      panelClass: ['info-snackbar'], // Custom CSS class for info
      ...config,
    });
  }

  private show(message: string, action: string | undefined, config: MatSnackBarConfig): void {
    this.snackBar.open(message, action, config);
  }
}
