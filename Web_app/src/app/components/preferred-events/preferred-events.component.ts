import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {DataService} from "../../services/data.service";
import {Ticket} from "../event-card/Ticket";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'preferred-events',
  templateUrl: './preferred-events.component.html',
  styleUrls: ['./preferred-events.component.css']
})
export class PreferredEventsComponent implements OnInit{
  items: any;
  ticketsMap: { [eventId: string]: Ticket[] } = {};
  userId: string = '';
  @Output() arePreferredEventsLoaded = new EventEmitter<boolean>();
  constructor(private dataService: DataService, private authService: AuthService) { }

  ngOnInit(): void {
    this.getUserId();
    if(this.userId !== ''){
      this.getPreferredEvents();
    }
  }

  getPreferredEvents(){
    this.dataService.getEventsBasedOnUserPreferences(this.userId).subscribe(
      (data: any) => {
        this.items = data.matchedEvents;

        if (this.items) {
          this.fetchTicketsForEachEvent();
          if(this.items.length > 0){
            this.arePreferredEventsLoaded.emit(true);
          }
        } else {
          console.error('No matched events found.');
        }
      },
      (error: any) => {
        console.error('Error fetching events based on user preferences:', error);
      }
    );
  }

  getUserId(){
    const currentUser = this.authService.currentUser;
    if (currentUser) {
      this.userId = currentUser.userId;
    }
  }

  fetchTicketsForEachEvent() {
    this.items.forEach((event: any) => {
      if (event._id) {
        this.dataService.getTicketsForEvent(event._id).subscribe((res: any) => {
          this.ticketsMap[event._id] = res;
        });
      } else {
        console.error('Event ID is undefined:', event);
      }
    });
  }


}
