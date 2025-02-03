import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SchedulerComponent } from './scheduler/scheduler.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { EventListComponent } from './scheduler/event-list/event-list.component';
import { EventFormComponent } from './shared/event-form/event-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SchedulerToolbarComponent } from './scheduler/scheduler-toolbar/scheduler-toolbar.component';
import { DayViewComponent } from './scheduler/day-view/day-view.component';
import { WeekViewComponent } from './scheduler/week-view/week-view.component';
import { MonthViewComponent } from './scheduler/month-view/month-view.component';
import { CoreModule } from './core/core.module';
import { AuthModule } from './auth/auth.module';
import { SharedModule } from './shared/shared.module';
import { SchedulerService } from './scheduler/scheduler.service';
import { DatePipe } from '@angular/common';
import { ThemeSwitcherComponent } from './theme-switcher/theme-switcher.component'; // Import ThemeSwitcherComponent
import { MatSlideToggleModule } from '@angular/material/slide-toggle'; // Import MatSlideToggleModule

@NgModule({
  declarations: [
    AppComponent,
    SchedulerComponent,
    EventListComponent,
    SchedulerToolbarComponent,
    DayViewComponent,
    WeekViewComponent,
    MonthViewComponent,
    ThemeSwitcherComponent // Declare ThemeSwitcherComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    ReactiveFormsModule,
    CoreModule,
    AuthModule,
    SharedModule,
    MatSlideToggleModule // Import MatSlideToggleModule
  ],
  providers: [SchedulerService, DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
