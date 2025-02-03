import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment'; // Import environment

@Injectable({
  providedIn: 'root'
})
export class LogService {

  error(message: string, error?: any): void {
    console.error(`ERROR: ${message}`, error); // Still log to console for development
    if (environment.production) {
      this.reportErrorToAnalytics('ERROR', message, error); // Report to Firebase Analytics in production
    }
  }

  warn(message: string, data?: any): void {
    console.warn(`WARN: ${message}`, data);
    if (environment.production) {
      this.reportEventToAnalytics('WARN', message, data); // Report warnings as events in production
    }
  }

  info(message: string, data?: any): void {
    console.info(`INFO: ${message}`, data);
    if (environment.production) {
      this.reportEventToAnalytics('INFO', message, data); // Report info as events in production
    }
  }

  debug(message: string, data?: any): void {
    console.debug(`DEBUG: ${message}`, data); // Debug logs are usually only for development
  }

  private reportErrorToAnalytics(level: string, message: string, error: any): void {
    if (firebase && firebase.analytics) { // Check if firebase and analytics are available
      firebase.analytics().logEvent('exception', {
        description: `${level}: ${message}`,
        fatal: true, // Indicate fatal error for 'error' level
        errorDetails: error ? JSON.stringify(error) : 'No details', // Stringify error details
      });
    } else {
      console.warn('Firebase Analytics is not available, cannot report error:', message, error);
    }
  }

  private reportEventToAnalytics(level: string, message: string, data: any): void {
    if (firebase && firebase.analytics) {
      firebase.analytics().logEvent('log_message', {
        level: level,
        message: message,
        logData: data ? JSON.stringify(data) : 'No data', // Stringify data
      });
    } else {
      console.warn('Firebase Analytics is not available, cannot report log event:', message, data);
    }
  }
}
