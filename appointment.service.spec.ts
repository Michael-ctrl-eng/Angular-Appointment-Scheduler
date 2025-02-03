import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing'; // Import HttpTestingController
import { AppointmentService } from './appointment.service'; // Import your service
import { Appointment } from './appointment.model'; // Assuming you have an Appointment model

describe('AppointmentService', () => {
  let service: AppointmentService;
  let httpTestingController: HttpTestingController; // Inject HttpTestingController

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], // Import HttpClientTestingModule
      providers: [AppointmentService] // Provide the service
    });
    service = TestBed.inject(AppointmentService);
    httpTestingController = TestBed.inject(HttpTestingController); // Get HttpTestingController instance
  });

  afterEach(() => {
    httpTestingController.verify(); // Ensure no outstanding HTTP requests after each test
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve appointments from the API', () => {
    const mockAppointments: Appointment[] = [ // Mock appointment data
      { id: '1', title: 'Appointment 1', start: new Date(), end: new Date() },
      { id: '2', title: 'Appointment 2', start: new Date(), end: new Date() }
    ];

    service.getAppointments().subscribe(appointments => { // Subscribe to the service method
      expect(appointments).toEqual(mockAppointments); // Assert that the returned data matches the mock data
    });

    const req = httpTestingController.expectOne('/api/appointments'); // Expect a single HTTP GET request to this URL
    expect(req.request.method).toEqual('GET'); // Assert that the request method is GET

    req.flush(mockAppointments); // Respond to the request with the mock data
  });

  it('should handle errors when retrieving appointments', () => {
    const errorMessage = 'Error fetching appointments';

    service.getAppointments().subscribe(
      () => fail('should have failed with an error'), // Should not succeed
      (error) => {
        expect(error).toContain(errorMessage); // Assert that the error message is as expected
      }
    );

    const req = httpTestingController.expectOne('/api/appointments');
    req.error(new ErrorEvent('Network error', { message: errorMessage })); // Respond with an error
  });
});
