import {Component, ElementRef, Input, OnInit, Renderer2} from '@angular/core';
import {DataService} from "../../../services/data.service";
import {AuthService} from "../../../services/auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {PanelManagerService} from "../../../services/panel-manager.service";
import {Router} from "@angular/router";
import {SnackbarComponent} from "../../snackbars/snackbar-error/snackbar.component";
import {SnackbarSuccessComponent} from "../../snackbars/snackbar-success/snackbar-success.component";


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

  // Edit data
  isEventFormSubmitted = false;
  eventName: string = '';
  eventText: string = '';
  eventCity: string = '';
  eventPlace: string = '';
  promoImage: string = '';
  additionalInfo: string = '';
  eventId: string = '';
  constructor(private service: DataService,
              private authService: AuthService,
              public panelManagerService: PanelManagerService,
              public router: Router,
              private _snackBar: MatSnackBar) {}
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
          // Assigns the total earnings to the specific event in eventDetails
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
          // Assigns the total sold tickets to the specific event in eventDetails
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

  navigateToEvent(isActive: boolean, eventId: string) {
    if (!isActive){
      return;
    }else if (eventId) {
      this.router.navigate(['event/detail', eventId]);
    }
  }

  // Snackbar messages
  openSnackBarError(errorMsg: string) {
    this._snackBar.openFromComponent(SnackbarComponent, {
      duration: 5000,
      data: { errorMsg: errorMsg },
      panelClass: ['snackbar-error-style']
    });
  }
  openSnackBarSuccess(msg: string) {
    this._snackBar.openFromComponent(SnackbarSuccessComponent, {
      duration: 5000,
      data: { msg: msg },
      panelClass: ['snackbar-success-style']
    });
  }
  openModal(event: any, modalId: string) {
    const locationParts = event.location.split(',');
    this.eventName = event.title;
    this.eventText = event.text;
    this.eventCity = locationParts[0].trim();
    this.eventPlace = locationParts[1].trim();
    this.promoImage = event.image;
    this.additionalInfo = event.additionalText;
    this.eventId = event.id;
    const modalDiv= document.getElementById(modalId);
    if(modalDiv != null)
    {
      modalDiv.style.display = 'block';
    }
  }
  closeModal(modalId: string) {
    const modalDiv= document.getElementById(modalId);
    if(modalDiv!= null)
    {
      modalDiv.style.display = 'none';
    }
  }

  deactivateEvent(eventId: string) {
    if(eventId){
      this.service.deactivateEvent(eventId).subscribe(
        () => {
          this.openSnackBarSuccess('Pomyślnie dezaktywowano wydarzenie.');
        },
        (error) => {
          this.openSnackBarError('Błąd podczas próby dezaktywacji wydarzenia.');
        }
      );
    }
  }

  isEventUpdateFormValidated(newEventDetails: any): boolean {
    const isAnyFieldEmpty =
      newEventDetails.title === '' ||
      newEventDetails.image === '' ||
      newEventDetails.text === '' ||
      newEventDetails.additionalText === '' ||
      newEventDetails.location === '';
    if (isAnyFieldEmpty) {
      this.isEventFormSubmitted = true;
      return false;
    }
    return true;
  }
  getEventLocation(){
    if(this.eventName !== ''){
      this.location = this.eventCity + ', ' + this.eventPlace;
    }
    else{
      this.location = this.eventCity;
    }
  }

  updateExistingEvent() {
    this.getEventLocation();

    let newEventDetails: any = {
      id: this.eventId,
      title: this.eventName,
      image: this.promoImage,
      text: this.eventText,
      additionalText: this.additionalInfo,
      organiser: this.organiserName,
      location: this.location,
    };

    if (!this.isEventUpdateFormValidated(newEventDetails)) {
      this.openSnackBarError('Niektóre wymagane pola są puste.');
      return;
    }

    if(!this.eventId){
      this.openSnackBarError('Problem z uzyskaniem id wydarzenia.');
      return;
    }

    // Starting the transaction
    this.service.updateExistingEvent(newEventDetails)
      .subscribe(
        (response: any) => {
          this.openSnackBarSuccess('Pomyślnie utworzono wydarzenie.');
          window.location.reload();
        },
        (error: any) => {
          console.error('Błąd podczas aktualizowania wydarzenia:', error);
          this.openSnackBarError('Błąd podczas tworzenia wydarzenia. Spróbuj ponownie.');
        }
      );
  }

}
