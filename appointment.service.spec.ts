// src/app/services/appointment.service.spec.ts (Example test file path - adjust if needed)
import { AppointmentService } from './appointment.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { of, throwError } from 'rxjs';
import { Appointment } from '../models/appointment.model'; // Correct model path
import { AppointmentServiceError, AppointmentServiceErrorType } from './appointment-service-error.model'; // Import custom error model
import { AuthService } from './auth.service'; // Assuming AuthService example
import { switchMap } from 'rxjs/operators';

describe('AppointmentService', () => {
    let service: AppointmentService;
    let firestoreMock: any;
    let authServiceMock: any; // Mock AuthService

    beforeEach(() => {
        firestoreMock = {
            collection: jest.fn().mockReturnThis(),
            valueChanges: jest.fn().mockReturnThis(), // mockReturnThis for chaining
            add: jest.fn().mockResolvedValue({ id: 'mockId' }) // Default resolve for add
        };
        authServiceMock = {
            isAuthenticated: jest.fn().mockReturnValue(of(true)) // Default: authenticated
        };

        service = new AppointmentService(
            firestoreMock as AngularFirestore,
            authServiceMock as AuthService
        );

        jest.spyOn(console, 'error').mockImplementation(() => { /* Prevent console output in tests */ }); // Suppress console errors during tests if desired
    });

    afterEach(() => {
        jest.restoreAllMocks(); // Restore all mocks after each test
    });


    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('getAppointments', () => { // Group tests for getAppointments
        it('should return appointments when authenticated and Firebase is successful', (done) => {
            const mockAppointments: Appointment[] = [ /* ... mock appointments data ... */ ];
            firestoreMock.valueChanges.mockReturnValue(of(mockAppointments));

            service.getAppointments().subscribe(appointments => {
                expect(appointments).toEqual(mockAppointments);
                expect(firestoreMock.collection).toHaveBeenCalledWith('appointments');
                expect(firestoreMock.valueChanges).toHaveBeenCalledWith({ idField: 'id' }); // Verify idField option used
                expect(authServiceMock.isAuthenticated).toHaveBeenCalled();
                done();
            });
        });

        it('should return AppointmentServiceError with AuthenticationErrorType if not authenticated', (done) => {
            authServiceMock.isAuthenticated.mockReturnValue(of(false)); // Mock not authenticated

            service.getAppointments().subscribe({
                next: () => fail('Expected error, but got success'),
                error: (error: AppointmentServiceError) => {
                    expect(error).toBeInstanceOf(AppointmentServiceError);
                    expect(error.type).toBe(AppointmentServiceErrorType.AuthenticationError);
                    expect(authServiceMock.isAuthenticated).toHaveBeenCalled();
                    done();
                }
            });
        });


        it('should handle Firebase error and return AppointmentServiceError with correct type', (done) => {
            const firebaseError = { code: 'permission-denied', message: 'Permission Denied' };
            firestoreMock.valueChanges.mockReturnValue(throwError(() => firebaseError));

            service.getAppointments().subscribe({
                next: () => fail('Expected error, but got success'),
                error: (error: AppointmentServiceError) => {
                    expect(error).toBeInstanceOf(AppointmentServiceError);
                    expect(error.type).toBe(AppointmentServiceErrorType.PermissionDeniedError);
                    expect(error.originalError).toEqual(firebaseError);
                    done();
                }
            });
        });

        it('should handle generic Firebase error and return AppointmentServiceError with UnknownErrorType', (done) => {
            const genericFirebaseError = new Error('Generic Firebase error');
            firestoreMock.valueChanges.mockReturnValue(throwError(() => genericFirebaseError));

            service.getAppointments().subscribe({
                next: () => fail('Expected error, but got success'),
                error: (error: AppointmentServiceError) => {
                    expect(error).toBeInstanceOf(AppointmentServiceError);
                    expect(error.type).toBe(AppointmentServiceErrorType.UnknownError);
                    expect(error.originalError).toEqual(genericFirebaseError);
                    done();
                }
            });
        });
    });

    describe('createAppointment', () => { // Group tests for createAppointment
        it('should create an appointment successfully and log success', async () => {
            const mockAppointment: Appointment = { title: 'Test Appointment', date: new Date(), time: '10:00' };
            const consoleLogSpy = jest.spyOn(console, 'log');

            await service.createAppointment(mockAppointment);

            expect(firestoreMock.collection).toHaveBeenCalledWith('appointments');
            expect(firestoreMock.add).toHaveBeenCalledWith(mockAppointment);
            expect(consoleLogSpy).toHaveBeenCalledWith('Appointment created successfully.');

            consoleLogSpy.mockRestore(); // Restore after use
        });

        it('should handle Firebase error during creation and throw AppointmentServiceError', async () => {
            const mockAppointment: Appointment = { title: 'Test Appointment', date: new Date(), time: '10:00' };
            const firebaseError = { code: 'unauthenticated', message: 'Not authenticated' };
            firestoreMock.add.mockRejectedValue(firebaseError);

            try {
                await service.createAppointment(mockAppointment);
                fail('Expected error, but got success');
            } catch (error) {
                expect(error).toBeInstanceOf(AppointmentServiceError);
                expect(error.type).toBe(AppointmentServiceErrorType.AuthenticationError);
                expect((error as AppointmentServiceError).originalError).toEqual(firebaseError);
            }
        });
    });

    // ... more tests for updateAppointment, deleteAppointment following similar patterns
});
