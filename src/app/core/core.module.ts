import { NgModule, ErrorHandler } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RestApiService } from './rest-api.service';
import { GlobalErrorHandler } from './global-error-handler';
import { AuthInterceptor } from '../auth/auth.interceptor';
import { ThemeService } from './theme.service'; // Import ThemeService

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [
    RestApiService,
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    ThemeService // Provide ThemeService here
  ]
})
export class CoreModule { }
