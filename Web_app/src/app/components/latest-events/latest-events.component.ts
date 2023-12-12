import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {Ticket} from "../event-card/Ticket";

@Component({
  selector: 'latest-events',
  templateUrl: './latest-events.component.html',
  styleUrls: ['./latest-events.component.css']
})
export class LatestEventsComponent{
  // TODO: wysyłać osobne zapytanie i pobierać tylko pierwsze 10 najpopularniejszych eventów, usunąć przekazywanie przez home page
  @Input() items$: any;
}
