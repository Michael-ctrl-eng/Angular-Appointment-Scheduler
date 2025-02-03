import { NgModule, ErrorHandler } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RestApiService } from './rest-api.service';
import { GlobalErrorHandler } from './global-error-handler';
import { AuthInterceptor } from '../auth/auth.interceptor'; // Adjusted path

/**
 * Core Module for essential services and configurations.
 * Provides application-wide services like API communication, error handling, and HTTP interceptors.
 */
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [
    RestApiService,
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ]
})
export class CoreModule { }
