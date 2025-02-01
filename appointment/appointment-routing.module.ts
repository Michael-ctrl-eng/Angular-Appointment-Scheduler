import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppointmentCalendarViewComponent } from './appointment-calendar-view/appointment-calendar-view.component';

const routes: Routes = [
  { path: '', component: AppointmentCalendarViewComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppointmentRoutingModule { }
