import {Component, Input} from '@angular/core';
import {Ticket} from "./Ticket"; //TODO: przenieść do interfejsów
@Component({
  selector: 'event-card',
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.css']
})

export class EventCardComponent {

  @Input() id?: string;

  @Input() title?: string;
  @Input() image?: string;
  @Input() text?: string;
  @Input() tickets: Ticket[] = [];
  @Input() date?: string;
  @Input() location?: string;

  // Returns lowest price from all of available tickets for an event
  getLowestTicketPrice(): number {
      if (!this.tickets || this.tickets.length === 0) {
        return 0; // Returns 0 if there are no tickets
      }

      return this.tickets.reduce((minPrice, ticket) => {
        return ticket.price < minPrice ? ticket.price : minPrice;
      }, this.tickets[0].price);
    }
}


