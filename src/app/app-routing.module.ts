import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SchedulerComponent } from './scheduler/scheduler.component';
import { LoginComponent } from './auth/login/login.component'; // Adjusted path
import { AuthGuard } from './auth/auth.guard'; // Adjusted path

/**
 * AppRoutingModule defines the routing configuration for the application.
 * Includes routes for login and the main scheduler component, protected by AuthGuard.
 */
const routes: Routes = [
  { path: 'login', component: LoginComponent }, // Route for the login component
  { path: 'scheduler', component: SchedulerComponent, canActivate: [AuthGuard] }, // Protected scheduler route with AuthGuard
  { path: '', redirectTo: '/scheduler', pathMatch: 'full' }, // Default route redirects to scheduler
  { path: '**', redirectTo: '/scheduler' } // Wildcard route, redirect to scheduler (or a 404 page if desired)
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
