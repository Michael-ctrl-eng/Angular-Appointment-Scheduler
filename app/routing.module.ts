import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'appointment',
    loadChildren: () => import('./appointment/appointment.module').then(m => m.AppointmentModule)
  },
  { path: '', redirectTo: 'appointment', pathMatch: 'full' }, // Redirect root to appointment module
  { path: '**', redirectTo: 'appointment' } // Redirect any unknown route to appointment module
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
