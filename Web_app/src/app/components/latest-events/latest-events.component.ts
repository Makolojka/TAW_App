import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {Ticket} from "../event-card/Ticket";
import {DataService} from "../../services/data.service";

@Component({
  selector: 'latest-events',
  templateUrl: './latest-events.component.html',
  styleUrls: ['./latest-events.component.css']
})
export class LatestEventsComponent implements OnInit{
  ticketsMap: { [eventId: string]: Ticket[] } = {};
  items: any;
  topFiveEvents: any;

  constructor(private service: DataService) { }

  ngOnInit(): void {
    this.service.getAll().subscribe(data => {
      this.items = data;
      this.fetchTicketsForEachEvent();
    });

    this.service.getTopFiveMostViewed().subscribe(data => {
      this.topFiveEvents = data;
    });
  }

  fetchTicketsForEachEvent() {
    this.items.forEach((event: any) => {
      this.service.getTicketsForEvent(event.id).subscribe((res: any) => {
        this.ticketsMap[event.id] = res;
      });
    });
  }
}
