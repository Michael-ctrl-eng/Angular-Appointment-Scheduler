import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Appointment } from '../shared/models/appointment.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment'; // Assuming you have environment files

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  private apiUrl = environment.apiUrl + '/appointments'; // Use environment variable for API URL

  constructor(private http: HttpClient) { }

  getAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(this.apiUrl);
  }

  getAppointment(id: string): Observable<Appointment | undefined> {
    return this.http.get<Appointment>(`${this.apiUrl}/${id}`);
  }

  createAppointment(appointment: Appointment): Observable<Appointment> {
    return this.http.post<Appointment>(this.apiUrl, appointment);
  }

  updateAppointment(appointment: Appointment): Observable<Appointment> {
    return this.http.put<Appointment>(`${this.apiUrl}/${appointment.id}`, appointment);
  }

  deleteAppointment(id: string): Observable<boolean> {
    return this.http.delete<boolean>(`${this.apiUrl}/${id}`);
  }

  checkResourceAvailability(resourceId: string, startTime: Date, endTime: Date, appointmentId?: string): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/check-resource-availability`, {
      resourceId: resourceId,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      appointmentId: appointmentId // Include appointmentId in request
    });
  }
}
