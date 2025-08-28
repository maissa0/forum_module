export interface Appointment {
  id?: string; // Optional for new appointments
  title: string;
  date: string; // Use appropriate date format
  time: string; // Use appropriate time format
  role: string; // Define the role associated with the appointment
}
