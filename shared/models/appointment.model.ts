export interface Appointment {
  id: string;
  appointmentType: string; // e.g., 'Consultation', 'Service', 'Meeting'
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  location?: string;
  attendees?: string[]; // Array of attendee names/IDs
  notes?: string;
  isRecurring?: boolean;
  recurrenceRule?: string; // e.g., using iCal RRULE format or a custom format
  resourceId?: string; // ID of the resource (room, staff, etc.)
  status?: 'scheduled' | 'pending' | 'confirmed' | 'cancelled' | 'completed';
  createdBy?: string; // User ID of creator
  createdDate?: Date;
  updatedBy?: string; // User ID of updater
  updatedDate?: Date;
  timeZone?: string; // Time zone for the appointment
  // ... Add more properties as needed for complexity
}
