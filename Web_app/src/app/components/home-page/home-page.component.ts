import {Component, OnInit} from '@angular/core';
import {DataService} from "../../services/data.service";
import {ActivatedRoute} from "@angular/router";
import {Ticket} from "../event-card/Ticket";
@Component({
  selector: 'home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  public items$: any;
  public dataLoaded = false;
  public ticketsMap: { [eventId: string]: Ticket[] } = {}; // Map to store tickets for each event

  constructor(private service: DataService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.getAll();
  }

  getAll() {
    this.service.getAll().subscribe((response) => {
      this.items$ = response;
      this.dataLoaded = true;
      this.fetchTicketsForEachEvent(); // Fetch tickets for each event after getting all events
    });
  }

  fetchTicketsForEachEvent() {
    this.items$.forEach((event: any) => {
      this.service.getTicketsForEvent(event.id).subscribe((res: any) => {
        this.ticketsMap[event.id] = res;
      });
    });
  }
}
