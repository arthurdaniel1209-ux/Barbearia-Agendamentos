
import { Appointment } from '../types';

// MOCK DATABASE
const bookedAppointments: { [date: string]: string[] } = {
  // Example: '2023-10-27': ['10:00', '14:30']
};

// --- MOCK API FUNCTIONS ---

/**
 * Simulates fetching available time slots for a given date from a calendar.
 * In a real application, this would make an API call to a backend service
 * which in turn queries the Google Calendar API.
 */
export const getAvailableSlots = async (date: Date): Promise<string[]> => {
  console.log(`Fetching slots for ${date.toDateString()}`);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  const dayOfWeek = date.getDay();
  // Barber doesn't work on Sunday (0) or Saturday (6)
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return [];
  }

  const workHours = { start: 9, end: 18 }; // 9 AM to 6 PM
  const slotDuration = 30; // 30 minutes
  const lunchBreak = { start: 12, end: 13 };

  const availableSlots: string[] = [];
  
  for (let hour = workHours.start; hour < workHours.end; hour++) {
    // Skip lunch break
    if (hour >= lunchBreak.start && hour < lunchBreak.end) {
      continue;
    }
    for (let minute = 0; minute < 60; minute += slotDuration) {
      const time = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
      availableSlots.push(time);
    }
  }

  // Filter out already booked slots for the given date
  const dateString = date.toISOString().split('T')[0];
  const bookedSlotsForDay = bookedAppointments[dateString] || [];
  
  const finalSlots = availableSlots.filter(slot => !bookedSlotsForDay.includes(slot));

  console.log(`Available slots: ${finalSlots.join(', ')}`);
  return finalSlots;
};

/**
 * Simulates booking an appointment.
 * In a real application, this would send appointment details to a backend service
 * which would create an event in the Google Calendar.
 */
export const bookAppointment = async (appointment: Appointment): Promise<{ success: boolean; message: string }> => {
  console.log('Booking appointment:', appointment);

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  const dateString = appointment.date.toISOString().split('T')[0];
  
  if (!bookedAppointments[dateString]) {
    bookedAppointments[dateString] = [];
  }

  // Check if slot is still available
  if (bookedAppointments[dateString].includes(appointment.time)) {
    return { success: false, message: 'Este horário foi agendado. Por favor, escolha outro.' };
  }

  // Book the slot
  bookedAppointments[dateString].push(appointment.time);
  
  // Also book the next slot if duration is longer than 30 mins
  if (appointment.service.duration > 30) {
      const [hour, minute] = appointment.time.split(':').map(Number);
      const nextSlotDate = new Date();
      nextSlotDate.setHours(hour, minute + 30, 0, 0);
      const nextSlotTime = `${String(nextSlotDate.getHours()).padStart(2, '0')}:${String(nextSlotDate.getMinutes()).padStart(2, '0')}`;
      bookedAppointments[dateString].push(nextSlotTime);
  }

  console.log('Updated bookings:', bookedAppointments);

  return { success: true, message: 'Agendamento confirmado com sucesso!' };
};
