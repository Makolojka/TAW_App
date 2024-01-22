import {Component, ElementRef, OnInit, Renderer2} from '@angular/core';
import {DataService} from "../../services/data.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Ticket} from "../event-card/Ticket";
import {AuthService} from "../../services/auth.service";
@Component({
  selector: 'home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  items$: any;
  dataLoaded = false;
  ticketsMap: { [eventId: string]: Ticket[] } = {}; // Map to store tickets for each event
  userId = '';
  oneTimeMonitChecked: boolean | undefined;
  showPreferredEvents = false;

  onItemsAvailable(itemsAvailable: boolean): void {
    this.showPreferredEvents = itemsAvailable;
  }

  constructor(private service: DataService,
              private router: Router,
              private authService: AuthService) {}

  ngOnInit() {
    this.getAll();
    this.getUserId();
    if (this.userId !== '') {
      this.fetchUserPreferences();
    }
  }

  getAll() {
    this.service.getAll().subscribe((response) => {
      this.items$ = response;
      this.dataLoaded = true;
      this.fetchTicketsForEachEvent();
    });
  }

  fetchTicketsForEachEvent() {
    this.items$.forEach((event: any) => {
      this.service.getTicketsForEvent(event.id).subscribe((res: any) => {
        this.ticketsMap[event.id] = res;
      });
    });
  }

  fetchUserPreferences(): void {
    this.service.getUserPreferences(this.userId).subscribe(
      (data: any) => {
        this.oneTimeMonitChecked = data.oneTimeMonitChecked;
        if (this.oneTimeMonitChecked === false) {
          this.openModal('personalizedOffersModal');
        }
      },
      (error: any) => {
        console.error('Error fetching user preferences:', error);
      }
    );
  }

  getUserId(){
    const currentUser = this.authService.currentUser;
    if (currentUser) {
      this.userId = currentUser.userId;
    }
  }

  openModal(modalId: string) {
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

  goToPreferences() {
    this.router.navigate(['/user-details']);
  }

  closeWithoutPreferences() {
    this.closeModal('personalizedOffersModal');
    if(this.userId !== ''){
      this.service.updateOneTimeMonitChecked(this.userId).subscribe(
        () => {
          console.log('oneTimeMonitChecked flag updated successfully');
        },
        (error) => {
          console.error('Error updating oneTimeMonitChecked flag:', error);
        }
      );
    }
  }

}
