interface Transaction {
  userId: string;
  tickets: {
    ticketId: string;
    eventId: string;
    count: number;
    singleTicketCost: number;
  }[];
  saleDate: Date;
  totalCost: number;
}

export default Transaction;

