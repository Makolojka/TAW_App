export interface Ticket {
  type: string;
  price: number;
  dayOfWeek: string;
  date: string;
  color: string;
  maxNumberOfTickets: number;
  availableTickets: number;
  seatNumber?: string | null;
}
