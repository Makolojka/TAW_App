import {Component, ElementRef, Input, OnInit, Renderer2} from '@angular/core';
import {DataService} from "../../../services/data.service";
import {AuthService} from "../../../services/auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {PanelManagerService} from "../../../services/panel-manager.service";

@Component({
  selector: 'active-events-panel',
  templateUrl: './active-events-panel.component.html',
  styleUrls: ['./active-events-panel.component.css']
})
export class ActiveEventsPanelComponent implements OnInit{
  // Organizer data
  @Input() userId: string = '';
  ownedEvents: any[] = [];
  eventDetails: any[] = [];
  areEventsPresent: boolean = false;
  organiserName: string = '';

  // Event data
  image: string = '';
  title: string = '';
  date: string = '';
  location: string = '';
  views: number = 0;

  totalSoldForEvent: number = 0;
  totalEarningsForEvent: number = 0;
  constructor(private service: DataService, private authService: AuthService, public panelManagerService: PanelManagerService) {}
  ngOnInit() {
    this.getOrganizerName();
    this.getOwnedEvents();
  }

  fetchEventDetails() {
    this.ownedEvents.forEach((eventId: string) => {
      this.service.getById(eventId).subscribe((res: any) => {
        this.eventDetails.push(res);
        this.getEventData(eventId); // Fetch statistics for the event
      });
    });
  }

  getEventData(eventId: string) {
    try {
      // Fetch total earnings for the event
      this.service.getTotalEarningsByEvent(eventId)
        .subscribe((earningsResponse: any) => {
          // Assign the total earnings to the specific event in eventDetails
          const eventIndex = this.eventDetails.findIndex(event => event.id === eventId);
          if (eventIndex !== -1) {
            this.eventDetails[eventIndex].totalEarningsForEvent = earningsResponse.totalEarningsForEvent;
          }
        }, error => {
          console.error('Error fetching total earnings:', error);
        });

      // Fetch sold tickets for the event
      this.service.getTicketsSoldByEvent(eventId)
        .subscribe((soldTicketsResponse: any) => {
          // Assign the total sold tickets to the specific event in eventDetails
          const eventIndex = this.eventDetails.findIndex(event => event.id === eventId);
          if (eventIndex !== -1) {
            this.eventDetails[eventIndex].totalSoldForEvent = soldTicketsResponse.ticketsSold;
          }
        }, error => {
          console.error('Error fetching sold tickets:', error);
        });
    } catch (error) {
      console.error('Error fetching event data:', error);
    }
  }

  // fetchEventEarnings(eventId: string): number{
  //   try {
  //     // Fetch total earnings for the event
  //     this.service.getTotalEarningsByEvent(eventId)
  //       .subscribe((earningsResponse: any) => {
  //         return earningsResponse.totalEarningsForEvent;
  //       }, error => {
  //         console.error('Error fetching total earnings:', error);
  //         return 0;
  //       });
  //   } catch (error) {
  //     console.error('Error fetching event data:', error);
  //     return 0;
  //   }
  //   return 0;
  // }
  //
  // fetchEventSoldTickets(eventId: string): number{
  //   try {
  //         // Fetch sold tickets for the event
  //         this.service.getTicketsSoldByEvent(eventId)
  //           .subscribe((soldTicketsResponse: any) => {
  //             return soldTicketsResponse.ticketsSold;
  //           }, error => {
  //             console.error('Error fetching sold tickets:', error);
  //             return 0;
  //           });
  //       } catch (error) {
  //         console.error('Error fetching event data:', error);
  //         return 0;
  //       }
  //   return 0;
  // }

  getOrganizerName(){
    const currentUser = this.authService.currentUser;
    if (currentUser) {
      this.organiserName = currentUser.name;
    }
  }

  getOwnedEvents(){
    this.service.getOwnedEvents(this.userId).subscribe(
      (res: any) => {
        this.ownedEvents = res.ownedEvents;
        // console.log('Owned Events:', this.ownedEvents);
        this.fetchEventDetails();
        if(this.ownedEvents.length !== 0){
          this.areEventsPresent = true;
        }
      },
      (error: any) => {
        console.error('Error:', error);
      }
    );
  }

}
