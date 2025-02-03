// src/app/components/appointment-calendar/appointment-calendar.component.integration.spec.ts (Example test file path)
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AppointmentCalendarComponent } from './appointment-calendar.component'; // Correct component path
import { AppointmentService } from '../../services/appointment.service'; // Correct service path
import { AngularFirestore } from '@angular/fire/firestore';
import { of, throwError } from 'rxjs';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FullCalendarModule } from '@fullcalendar/angular'; // Assuming FullCalendar based on repo
import { Appointment } from '../../models/appointment.model'; // Correct model path
import { AppointmentServiceError, AppointmentServiceErrorType } from '../../services/appointment-service-error.model'; // Correct error model path

describe('AppointmentCalendarComponent Integration Tests', () => {
    let component: AppointmentCalendarComponent;
    let fixture: ComponentFixture<AppointmentCalendarComponent>;
    let appointmentService: AppointmentService;
    let firestoreMock: any;

    beforeEach(waitForAsync(() => { // waitForAsync for asynchronous TestBed setup
        firestoreMock = { // Minimal mock - just for valueChanges
            collection: jest.fn().mockReturnThis(),
            valueChanges: jest.fn()
        };

        TestBed.configureTestingModule({
            declarations: [AppointmentCalendarComponent],
            providers: [
                AppointmentService,
                { provide: AngularFirestore, useValue: firestoreMock }
            ],
            imports: [
                MatSnackBarModule,
                NoopAnimationsModule,
                FullCalendarModule // Import FullCalendarModule for integration test
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AppointmentCalendarComponent);
        component = fixture.componentInstance;
        appointmentService = TestBed.inject(AppointmentService);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should load appointments and render them on the calendar', waitForAsync(() => { // waitForAsync for asynchronous component setup
        const mockAppointments: Appointment[] = [ /* ... mock appointment data ... */ ];
        firestoreMock.valueChanges.mockReturnValue(of(mockAppointments));

        fixture.detectChanges(); // Trigger ngOnInit

        fixture.whenStable().then(() => { // Wait for async operations (service call)
            fixture.detectChanges(); // Re-detect changes after data load

            const calendarEvents = component.calendarOptions.events as any[]; // Access calendar events (adjust type if needed based on FullCalendar version)
            expect(calendarEvents).toBeDefined();
            expect(calendarEvents.length).toBe(mockAppointments.length);
            // ... you can add more specific checks to verify calendar event properties if needed (e.g., title, start date, etc.)
        });
    }));

    it('should display snackbar error message if loading appointments fails', waitForAsync(() => {
        const serviceError = new AppointmentServiceError('Failed to load', AppointmentServiceErrorType.NetworkError);
        firestoreMock.valueChanges.mockReturnValue(throwError(() => serviceError)); // Mock service to return error

        fixture.detectChanges(); // Trigger ngOnInit

        fixture.whenStable().then(() => {
            fixture.detectChanges();
            const snackBarElement = document.querySelector('snack-bar-container');
            expect(snackBarElement).toBeTruthy();
            expect(snackBarElement.textContent).toContain('Network error'); // Check for specific error message part
        });
    }));

    it('should set loadingAppointments flag correctly during loading', () => {
        firestoreMock.valueChanges.mockReturnValue(of([])); // Mock success (empty array is okay for loading test)

        fixture.detectChanges();
        expect(component.loadingAppointments).toBe(true); // Initially loading

        fixture.whenStable().then(() => {
            fixture.detectChanges();
            expect(component.loadingAppointments).toBe(false); // Loading finished
        });
    });
});
