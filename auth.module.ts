import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { LoginComponent } from './login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module'; // Import MaterialModule for MatFormField, MatInput, etc.

/**
 * Auth Module for authentication related components, services, and guards.
 * Provides login functionality and protects routes with authentication checks.
 */
@NgModule({
  declarations: [
    LoginComponent // Declare LoginComponent in AuthModule
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule // Include MaterialModule for LoginComponent UI
  ],
  providers: [
    AuthService,
    AuthGuard
  ],
  exports: [
    LoginComponent // Export LoginComponent for use in AppModule or other modules if needed
  ]
})
export class AuthModule { }
