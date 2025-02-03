
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LogService {

  error(message: string, error?: any): void {
    console.error(`ERROR: ${message}`, error);
    // Optionally, send error logs to a server or error tracking service
    // Example (if using Firebase):
    // firebase.analytics().logEvent('exception', { description: message, fatal: true });
  }

  warn(message: string, data?: any): void {
    console.warn(`WARN: ${message}`, data);
  }

  info(message: string, data?: any): void {
    console.info(`INFO: ${message}`, data);
  }

  debug(message: string, data?: any): void {
    console.debug(`DEBUG: ${message}`, data);
  }
}
