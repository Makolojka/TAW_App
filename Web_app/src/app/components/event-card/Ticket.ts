export interface Ticket {
  _id: string;
  type: string;
  price: number;
  dayOfWeek: string;
  date: string;
  color: string;
  maxNumberOfTickets: number;
  availableTickets: number;
}
