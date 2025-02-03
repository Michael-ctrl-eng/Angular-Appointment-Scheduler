import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap, switchMap, take } from 'rxjs/operators'; // Added more operators
import { Appointment } from '../models/appointment.model'; // Using repo's model path
import { AppointmentServiceError, AppointmentServiceErrorType } from './appointment-service-error.model'; // Assuming you create this error model
import { AuthService } from './auth.service'; // Assuming you add an AuthService for potential auth-related errors

@Injectable({
    providedIn: 'root'
})
export class AppointmentService {
    private appointmentsCollection: AngularFirestoreCollection<Appointment>;

    constructor(
        private afs: AngularFirestore,
        private authService: AuthService // Inject AuthService
    ) {
        this.appointmentsCollection = afs.collection<Appointment>('appointments');
    }

    getAppointments(): Observable<Appointment[]> {
        return this.authService.isAuthenticated().pipe( // Example: Authenticated access check
            switchMap(isAuthenticated => { // switchMap to ensure auth check completes first
                if (!isAuthenticated) {
                    return throwError(() => new AppointmentServiceError('User not authenticated.', AppointmentServiceErrorType.AuthenticationError));
                }
                return this.appointmentsCollection.valueChanges({ idField: 'id' }).pipe( // Get IDs
                    map(appointments => appointments as Appointment[]), // Cast to correct type (optional, for stronger typing)
                    catchError((error: any) => {
                        console.error('Firebase Error fetching appointments:', error);
                        let errorType = AppointmentServiceErrorType.UnknownError;
                        let errorMessage = 'Failed to load appointments from Firebase.';

                        // Firebase specific error handling - e.g., permission errors
                        if (error && error.code === 'permission-denied') {
                            errorType = AppointmentServiceErrorType.PermissionDeniedError;
                            errorMessage = 'Permission denied to access appointments. Check Firebase security rules.';
                        } else if (error && error.code === 'unavailable') {
                            errorType = AppointmentServiceErrorType.NetworkError;
                            errorMessage = 'Service unavailable. Please check your network connection or try again later.';
                        }
                        // Add more Firebase error code checks as needed (e.g., 'unauthenticated', 'resource-exhausted')

                        return throwError(() => new AppointmentServiceError(errorMessage, errorType, error));
                    })
                );
            }),
            catchError(outerError => { // Catch errors from authService.isAuthenticated() too
                console.error('Authentication error:', outerError);
                return throwError(() => outerError); // Re-throw the auth error itself, or wrap in AppointmentServiceError if needed.
            })
        );
    }

    createAppointment(appointment: Appointment): Promise<void> {
        return this.appointmentsCollection.add(appointment).then(() => {
            console.log('Appointment created successfully.');
        }).catch((error: any) => {
            console.error('Firebase Error creating appointment:', error);
            let errorType = AppointmentServiceErrorType.UnknownError;
            let errorMessage = 'Failed to create appointment in Firebase.';

            // Example: Firebase validation errors might come back in `error.details` (check Firebase documentation for structure)
            if (error && error.details && Array.isArray(error.details)) { // Example for Firebase validation
                errorType = AppointmentServiceErrorType.ValidationError;
                errorMessage = 'Validation error during appointment creation. ' + error.details.map(detail => detail.message).join('; '); // Construct detailed message
            } else if (error && error.code === 'unauthenticated') {
                errorType = AppointmentServiceErrorType.AuthenticationError;
                errorMessage = 'Authentication required to create appointments.';
            }
            // Add more specific Firebase error handling logic as needed

            throw new AppointmentServiceError(errorMessage, errorType, error);
        });
    }

    // ... similar enhanced error handling for updateAppointment, deleteAppointment
}
