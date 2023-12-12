import {Component, ElementRef, Input, OnInit, Renderer2} from '@angular/core';
import {DataService} from "../../../services/data.service";
import {PanelManagerService} from "../../../services/panel-manager.service";
import {SnackbarComponent} from "../../snackbars/snackbar-error/snackbar.component";
import {SnackbarSuccessComponent} from "../../snackbars/snackbar-success/snackbar-success.component";
import {AuthService} from "../../../services/auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Ticket} from "../../../interfaces/ticket";

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
  startDate: Date = new Date('');
  startDateTime: string = '';
  endDate: Date = new Date('');
  endDateTime: string = '';

  selectedCategories: string[] = [];
  selectedSubCategories: string[] = [];

  // Cinema schema builder
  cinemaSchema: {
    rows: number;
    columns: number;
    seats: { type: string | null }[][];
  }[] = [];
  roomRows: number = 1;
  roomColumns: number = 1;
  selectedAlignment: string = 'center';

  selectedTicket: Ticket | null = null;

  addRoomSchema(rows: number, columns: number): void {
    const newRoom = {
      rows,
      columns,
      seats: Array.from({ length: rows }, () => Array.from({ length: columns }, () => ({ type: null }))),
    };
    this.cinemaSchema.push(newRoom);
    console.log("cinemaSchema after adding new row: ",this.cinemaSchema)
  }
  removeLastRow(): void {
    if (this.cinemaSchema.length > 0) {
      this.cinemaSchema.pop();
    }
  }

  getNumberArray(count: number): number[] {
    // console.log("getNumberArray method, array: ",Array(count).fill(0).map((x, i) => i))
    return Array(count).fill(0).map((x, i) => i);
  }

  isAlignmentSelected(alignment: string): boolean {
    return this.selectedAlignment === alignment;
  }

  toggleAlignment(alignment: string) {
    this.selectedAlignment = alignment;
  }

  getSeatNumber(room: { rows: number, columns: number }, row: number, column: number): string {
    const rowNum = this.cinemaSchema.findIndex(r => r === room) + 1;
    return rowNum + '.' + (column + 1);
  }

  getSeatColor(roomIndex: number, rowIndex: number, columnIndex: number): string {
    const seat = this.cinemaSchema[roomIndex].seats[rowIndex][columnIndex];
    const matchingTicket = this.tickets.find(ticket => ticket.type === seat.type);

    return matchingTicket ? matchingTicket.color : 'transparent';
  }



  selectTicket(ticket: Ticket){
    this.selectedTicket = ticket;
  }

  getBackgroundColor(index: number): any {
    const colors = ['#3498db', '#2ecc71', '#f39c12', '#9b59b6', '#e74c3c', '#1abc9c', '#34495e', '#e67e22', '#27ae60', '#95a5a6'];

    if (index < this.tickets.length) {
      return { 'background-color': this.tickets[index].color };
    } else {
      return { 'background-color': colors[index % colors.length] };
    }
  }

  applyColorToSeat(roomIndex: number, rowIndex: number, columnIndex: number, ticketType: string): void {
    this.cinemaSchema[roomIndex].seats[rowIndex][columnIndex].type = ticketType;
    console.log("cinemaSchema after applyToSeat: ", this.cinemaSchema)
  }

  applyColorToRow(roomIndex: number, rowIndex: number, ticketType: string): void {
    this.cinemaSchema[roomIndex].seats[rowIndex].forEach(seat => {
      seat.type = ticketType;
    });
    console.log("cinemaSchema after applyToSeat: ", this.cinemaSchema)
  }


  onChange(value: number) {
    if (value < 1) {
      this.roomColumns = 1;
    } else if (value > 20) {
      this.roomColumns = 20;
    } else {
      this.roomColumns = value;
    }
  }


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
              private _snackBar: MatSnackBar, public panelManagerService: PanelManagerService) {}

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
      this.artistsParticipating.push(artist); // Add the artist if not already present
    } else {
      this.artistsParticipating.splice(index, 1); // Remove the artist if already present
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
      this.location = this.eventCity + ', ' + this.eventName;
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
    let newEventDetails = {
      title: this.eventName,
      image: this.promoImage,
      text: this.eventText,
      additionalText: this.additionalInfo,
      organiser: this.organiserName,
      date: this.startDate.toString(),
      location: this.location,
      category: this.selectedCategories,
      subCategory: this.selectedSubCategories,
      tickets: this.tickets,
      artists: artistIds,
      likes: [],
      followers: [],
      views: 0,
    };
    console.log("newEventDetails: ", newEventDetails)
    if (!this.isEventFormValidated(newEventDetails)) {
      console.error('Some required fields are empty:', newEventDetails);
      this.openSnackBarError('Some required fields are empty.');
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

  protected readonly Object = Object;
}
