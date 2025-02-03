import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Import Angular Material modules that might be used by NotificationService or other components
import { MatSnackBarModule } from '@angular/material/snack-bar';

// Import your custom services
import { GlobalErrorHandlerService } from './core/services/global-error-handler.service';
import { NotificationService } from './core/services/notification.service';
import { LogService } from './core/services/log.service';

// Import other modules for your application features (if you have them)
// Example: import { AppointmentModule } from './appointment/appointment.module';
// Example: import { AuthModule } from './auth/auth.module';

// Import HttpClientModule if you are making HTTP requests
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    // ... your other components that are declared directly in AppModule (if any) ...
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSnackBarModule, // Import MatSnackBarModule for NotificationService (if used)
    HttpClientModule, // Import HttpClientModule if you are using HttpClient

    // ... Import your feature modules here (if you have them) ...
    // Example: AppointmentModule,
    // Example: AuthModule,
  ],
  providers: [
    NotificationService, // Provide NotificationService (if it's not already provided in a feature module)
    LogService,         // Provide LogService (if it's not already provided)
    { provide: ErrorHandler, useClass: GlobalErrorHandlerService } // Register GlobalErrorHandlerService as the global ErrorHandler
    // ... other services that are provided at the AppModule level ...
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
