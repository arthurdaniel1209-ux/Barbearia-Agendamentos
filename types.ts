
export interface Service {
  id: number;
  name: string;
  duration: number; // in minutes
  price: string;
}

export interface Appointment {
  service: Service;
  date: Date;
  time: string;
  clientName: string;
  clientPhone: string;
}
