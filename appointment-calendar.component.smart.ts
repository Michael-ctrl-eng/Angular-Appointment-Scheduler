// Modified `appointment-calendar.component.ts` - "Smart" Container
@Component({ /* ... selector, templateUrl, styleUrls */ })
export class AppointmentCalendarComponent implements OnInit, OnDestroy {
    calendarOptions: CalendarOptions = { /* ... */ };
    appointments: Appointment[] = [];
    loadingAppointments = true;
    errorLoadingAppointments = false;
    private ngUnsubscribe = new Subject<void>(); // RxJS Subject for unsubscriptions

    constructor(
        private appointmentService: AppointmentService,
        private snackBar: MatSnackBar
    ) { }

    ngOnInit(): void {
        this.loadAppointments();
    }

    ngOnDestroy(): void { // Implement OnDestroy and unsubscribe
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    loadAppointments(): void {
        this.loadingAppointments = true;
        this.errorLoadingAppointments = false;

        this.appointmentService.getAppointments().pipe(
            takeUntil(this.ngUnsubscribe) // Unsubscribe when component destroys
        ).subscribe({
            next: (appointments) => {
                this.appointments = appointments;
                this.calendarOptions.events = appointments.map(appt => ({
                    title: appt.title,
                    start: new Date(appt.date).toISOString()
                }));
                this.loadingAppointments = false;
            },
            error: (error: AppointmentServiceError) => {
                this.loadingAppointments = false;
                this.errorLoadingAppointments = true;
                // ... (same error handling and snackbar display as before) ...
            }
        });
    }
}
