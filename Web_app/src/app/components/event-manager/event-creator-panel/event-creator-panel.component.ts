import {Component, ElementRef, Input, OnInit, Renderer2} from '@angular/core';
import {DataService} from "../../../services/data.service";
import {PanelManagerService} from "../../../services/panel-manager.service";
import {SnackbarComponent} from "../../snackbars/snackbar-error/snackbar.component";
import {SnackbarSuccessComponent} from "../../snackbars/snackbar-success/snackbar-success.component";
import {AuthService} from "../../../services/auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Ticket} from "../../../interfaces/ticket";
import {Row} from "../../../interfaces/row";
import {DatePipe, Time} from "@angular/common";

@Component({
  selector: 'app-event-creator-panel',
  templateUrl: './event-creator-panel.component.html',
  styleUrls: ['./event-creator-panel.component.css']
})
export class EventCreatorPanelComponent implements OnInit{

  // Event form data:
  @Input() userId: string = '';
  organiserName: string = '';

  isEventFormSubmitted = false;

  // Event creator
  stepNumber: number = 1;
  basicInfoVisible = false;
  locationVisible = false;
  posterVisible = false;
  additionalInfoVisible = false;
  detailsVisible = false;
  artistsVisible = false;

  // 1. step - Basic info vars
  eventName: string = '';
  eventText: string = '';
  isStartDate: boolean = false;
  startDate: Date | null = null;
  startDateTime: Time | null = null;
  endDate: Date | null = null;
  endDateTime: Time | null = null;

  selectedCategories: string[] = [];
  selectedSubCategories: string[] = [];

  // Cinema schema builder
  roomSchema: Row[] = [];
  roomSchemaStyle: string = 'center';

  // 2. step - Location vars
  eventCity: string = '';
  eventPlace: string = '';

  // 3. step - Promo image
  promoImage: string = '';

  // 4. step - Additional info
  additionalInfo: string = '';

  // 5. step - Ticket add
  tickets: Ticket[] = [];
  newTicket = {
    type: '',
    price: 0,
    dayOfWeek: '',
    date: '',
    color: '',
    maxNumberOfTickets: 0,
    availableTickets: 0,
  };

  // 6. step - Artist add
  artists: any[] = [];
  artistsParticipating: any[] = [];
  areTicketsPresent: boolean = false;

  searchQuery: string = '';

  newArtist = {
    name: '',
    image: '',
    shortDescription: '',
    career: ''
  };
  isFormSubmitted: boolean = false;
  incorrectArtistInfo = false;
  constructor(private service: DataService, private authService: AuthService, private elementRef: ElementRef,
              private renderer: Renderer2,
              private _snackBar: MatSnackBar, public panelManagerService: PanelManagerService, private datePipe: DatePipe) {}

  ngOnInit(){
    this.basicInfoVisible = true;
    this.checkIfTicketsPresent();
    this.getOrganizerName();
  }

  toggleCategory(type: string, value: string) {
    if(type==='category'){
      const index = this.selectedCategories.indexOf(value);
      if (index !== -1) {
        // Category exists, remove it
        this.selectedCategories.splice(index, 1);
      } else {
        // Category does not exist, add it
        this.selectedCategories.push(value);
      }
    }
    else if(type==='subCategory'){
      const index = this.selectedSubCategories.indexOf(value);
      if (index !== -1) {
        // Category exists, remove it
        this.selectedSubCategories.splice(index, 1);
      } else {
        // Category does not exist, add it
        this.selectedSubCategories.push(value);
      }
    }

    // console.log(this.selectedCategories)
    // console.log(this.selectedSubCategories)
  }

  isCategorySelected(category: string) {
    return this.selectedCategories.includes(category);
  }
  isSubCategorySelected(subCategory: string) {
    return this.selectedSubCategories.includes(subCategory);
  }
  toggleCreatorPanel(panelName: string) {
    // Reset visibility for all panels
    this.basicInfoVisible = false;
    this.locationVisible = false;
    this.posterVisible = false;
    this.additionalInfoVisible = false;
    this.detailsVisible = false;
    this.artistsVisible = false;

    // Set the visibility for the selected panel
    switch (panelName) {
      case 'basicInfo':
        this.basicInfoVisible = true;
        this.locationVisible = false;
        this.posterVisible = false;
        this.additionalInfoVisible = false;
        this.detailsVisible = false;
        this.artistsVisible = false;
        this.stepNumber = 1;
        break;
      case 'location':
        this.basicInfoVisible = false;
        this.locationVisible = true;
        this.posterVisible = false;
        this.additionalInfoVisible = false;
        this.detailsVisible = false;
        this.artistsVisible = false;
        this.stepNumber = 2;
        break;
      case 'poster':
        this.basicInfoVisible = false;
        this.locationVisible = false;
        this.posterVisible = true;
        this.additionalInfoVisible = false;
        this.detailsVisible = false;
        this.artistsVisible = false;
        this.stepNumber = 3;
        break;
      case 'additionalInfo':
        this.basicInfoVisible = false;
        this.locationVisible = false;
        this.posterVisible = false;
        this.additionalInfoVisible = true;
        this.detailsVisible = false;
        this.artistsVisible = false;
        this.stepNumber = 4;
        break;
      case 'details':
        this.basicInfoVisible = false;
        this.locationVisible = false;
        this.posterVisible = false;
        this.additionalInfoVisible = false;
        this.detailsVisible = true;
        this.artistsVisible = false;
        this.stepNumber = 5;
        break;
      case 'artists':
        this.basicInfoVisible = false;
        this.locationVisible = false;
        this.posterVisible = false;
        this.additionalInfoVisible = false;
        this.detailsVisible = false;
        this.artistsVisible = true;
        this.stepNumber = 6;
        break;
    }
  }

  openModal(modalId: string) {
    const modalDiv= document.getElementById(modalId);
    if(modalDiv != null)
    {
      modalDiv.style.display = 'block';
    }
    if(modalId === 'artistsBase'){
      this.getAllArtists();
    }
    this.lowerBrightness();
  }
  closeModal(modalId: string) {
    const modalDiv= document.getElementById(modalId);
    if(modalDiv!= null)
    {
      modalDiv.style.display = 'none';
    }
    this.raiseBrightness();
  }

  lowerBrightness() {
    const element = this.elementRef.nativeElement.querySelector('.main');
    if (element) {
      this.renderer.addClass(element, 'brightness-70');
    }
  }
  raiseBrightness() {
    const element = this.elementRef.nativeElement.querySelector('.main');
    if (element) {
      this.renderer.removeClass(element, 'brightness-70');
    }
  }

  //  Get all artists
  getAllArtists() {
    this.service.getAllArtists().subscribe(
      (res: any) => {
        this.artists = res;
      },
      (error: any) => {
        console.error('Error fetching artists:', error);
      }
    );
  }

  // Add or remove an artist from artistParticipating array
  toggleArtist(artist: any) {
    const index = this.artistsParticipating.findIndex((a) => a.id === artist.id);
    if (index === -1) {
      this.artistsParticipating.push(artist);
      this.openSnackBarSuccess("Artysta został dodany.");
    } else {
      this.artistsParticipating.splice(index, 1);
      this.openSnackBarSuccess("Artysta został usunięty.");
    }
  }

  // Create new artist
  createNewArtist() {
    if (this.validateForm()) {
      return this.service.createNewArtist(this.newArtist).subscribe(
        (result) => {
          this.newArtist = {
            name: '',
            image: '',
            shortDescription: '',
            career: ''
          };
          this.closeModal("createNewArtist");
          this.openSnackBarSuccess("Pomyślnie utworzono nowego artystę.");
        },
        (error) => {
          if(error){
            this.openSnackBarError("Coś poszło nie tak: " + error);
          }
        }
      );
    }
    return;
  }

  get filteredArtists(): any[] {
    return this.artists.filter(artist =>
      artist.name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  validateForm(): boolean {
    if (!this.newArtist.name || !this.newArtist.image || !this.newArtist.shortDescription) {
      this.isFormSubmitted = true;
      return false;
    }
    return true;
  }

  // Create new ticket
  createNewTicket() {
    try{
      if (this.validateTicketForm()) {
        const newTicket: Ticket = {
          type: this.newTicket.type,
          price: this.newTicket.price,
          dayOfWeek: this.newTicket.dayOfWeek,
          date: this.newTicket.date,
          color: this.newTicket.color,
          maxNumberOfTickets: this.newTicket.maxNumberOfTickets,
          availableTickets: this.newTicket.maxNumberOfTickets,
        };
        this.tickets.push(newTicket);
        this.openSnackBarSuccess("Pomyślnie utworzono nowy bilet.");
        this.checkIfTicketsPresent();
        this.closeModal('createNewTicket');
        this.newTicket = {
          type: '',
          price: 0,
          dayOfWeek: '',
          date: '',
          color: '',
          maxNumberOfTickets: 0,
          availableTickets: 0,
        };
      }
    }
    catch (error){
      if(error){
        this.openSnackBarError("Problem z utworzeniem biletu: " + error);
      }
    }
  }

  checkIfTicketsPresent(){
    this.areTicketsPresent = this.tickets.length !== 0;
  }

  validateTicketForm(): boolean {
    if (!this.newTicket.type || !this.newTicket.price || !this.newTicket.dayOfWeek || !this.newTicket.date || !this.newTicket.maxNumberOfTickets) {
      this.isFormSubmitted = true;
      this.openSnackBarError("Problem z utworzeniem biletu.");
      return false;
    }
    return true;
  }

  // Edit a ticket
  editedTicket: Ticket = { type: '', price: 0, dayOfWeek: '', date: '', color: '', maxNumberOfTickets: 0, availableTickets: 0};

  editTicket(type: string) {
    const selectedTicket = this.tickets.find(ticket => ticket.type === type);
    if (selectedTicket) {
      this.editedTicket = { ...selectedTicket };
      this.openModal('updateTicketModal');
    }
  }
  updateTicket(updatedTicket: Ticket) {
    const index = this.tickets.findIndex(ticket => ticket.type === updatedTicket.type);
    if (index !== -1) {
      this.tickets[index] = { ...this.tickets[index], ...updatedTicket };
      this.closeModal('updateTicketModal');
    }
  }


  // Delete a ticket
  deleteTicket(index: number) {
    this.tickets.splice(index, 1);
    this.checkIfTicketsPresent();
    // console.log("delete this.checkIfTicketsPresent();",this.areTicketsPresent)
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

  protected readonly open = open;

  // Create event method and parsers
  location: string = '';
  getEventLocation(){
    if(this.eventName !== ''){
      this.location = this.eventCity + ', ' + this.eventPlace;
    }
    else{
      this.location = this.eventCity;
    }
  }

  getOrganizerName(){
    const currentUser = this.authService.currentUser;
    if (currentUser) {
      this.organiserName = currentUser.name;
    }
  }

  isEventFormValidated(newEventDetails: any): boolean {
    const isAnyFieldEmpty =
      newEventDetails.title === '' ||
      newEventDetails.image === '' ||
      newEventDetails.text === '' ||
      newEventDetails.additionalText === '' ||
      newEventDetails.organiser === '' ||
      newEventDetails.location === '';

    const isAnyArrayEmpty =
      newEventDetails.category.length === 0 ||
      newEventDetails.subCategory.length === 0 ||
      newEventDetails.tickets.length === 0

    const isStartDateEmpty = !newEventDetails.date;

    if (isAnyFieldEmpty || isAnyArrayEmpty || isStartDateEmpty) {
      this.isEventFormSubmitted = true;
      console.log("validateEventForm false");
      return false;
    }
    console.log("validateEventForm true");
    return true;
  }

  createNewEvent() {
    this.getEventLocation();
    const artistIds = this.artistsParticipating.map((artist) => artist.id)
    let newEventDetails: any = {
      title: this.eventName,
      image: this.promoImage,
      text: this.eventText,
      additionalText: this.additionalInfo,
      organiser: this.organiserName,
      date: this.generateDateRange(),
      location: this.location,
      category: this.selectedCategories,
      subCategory: this.selectedSubCategories,
      tickets: this.tickets,
      artists: artistIds,
      likes: [],
      followers: [],
      views: 0,
    };

    if (
      this.selectedCategories.includes('Kino') &&
      this.roomSchema.length !== 0 &&
      this.roomSchema.every(row => {
        return row.seats.every(seat => {
          return seat.type.trim() !== '';
        });
      })
    ) {
      newEventDetails.roomSchema = {
        roomSchema: this.roomSchema || [],
        roomSchemaStyle: this.roomSchemaStyle || '',
      };
    } else if(this.selectedCategories.includes('Kino') && this.roomSchema.length === 0){
      this.openSnackBarError('Stwórz poprawnie schemat swojego kina.');
      return;
    }
    console.log("newEventDetails: ", newEventDetails)
    if (!this.isEventFormValidated(newEventDetails)) {
      this.openSnackBarError('Niektóre wymagane pola są puste.');
      return;
    }

    // Starting the transaction
    this.service.createNewEvent(newEventDetails)
      .subscribe(
        (response: any) => {
          this.openSnackBarSuccess('Pomyślnie utworzono wydarzenie.');
          window.location.reload();
        },
        (error: any) => {
          console.error('Błąd podczas tworzenia wydarzenia:', error);
          this.openSnackBarError('Błąd podczas tworzenia wydarzenia. Spróbuj ponownie.');
        }
      );
  }

  generateDateRange(): string {
    const formattedStartDate = this.datePipe.transform(this.startDate, 'dd.MM.yyyy');
    const formattedEndDate = this.datePipe.transform(this.endDate, 'dd.MM.yyyy');

    const formattedStartDateWithTime = `${formattedStartDate} ${this.startDateTime}`;
    const formattedEndDateWithTime = `${formattedEndDate} ${this.endDateTime}`;
    try{
      this.updateStartDateFlag();
      if (this.startDate && !this.endDate && !this.startDateTime) {
        return <string>formattedStartDate;
      } else if (this.startDate && this.startDateTime && !this.endDate && !this.endDateTime) {
        return formattedStartDateWithTime;
      } else if (this.startDate && !this.startDateTime && this.endDate && !this.endDateTime) {
        return `${formattedStartDate} - ${formattedEndDate}`;
      } else if (this.startDate && this.startDateTime && this.endDate && this.endDateTime) {
        return `${formattedStartDateWithTime} - ${formattedEndDateWithTime}`;
      }

      return <string>formattedStartDate;
    }catch (error){
      console.log("Unknown error or date format")
      return "";
    }
  }
  updateStartDateFlag() {
    if(this.startDate)
    {
      this.isStartDate = true;
    }
    else {
      this.isStartDate = false;
    }
  }

  protected readonly Object = Object;
}
