import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../../services/data.service';
import { AuthService } from '../../services/auth.service';
import { Ticket } from "../event-card/Ticket";

@Component({
  selector: 'wish-list',
  templateUrl: './wish-list.component.html',
  styleUrls: ['./wish-list.component.css'],
})
export class WishListComponent implements OnInit {
  private userId: string = '';
  public items$: any;
  public isItemsEmpty: boolean = false;
  public ticketsMap: { [eventId: string]: Ticket[] } = {};
  public lowestPrices: { [eventId: string]: number } = {}; // Store the lowest prices here

  constructor(
    private route: ActivatedRoute,
    private service: DataService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.userId = this.authService.getUserId();
    this.service
      .getUserLikedOrFollowedEvents(this.userId, 'follow')
      .subscribe((response) => {
        this.items$ = response;
        if (this.items$.length > 0) {
          this.isItemsEmpty = false;
        }
        else{
          this.isItemsEmpty = true;
        }
        this.fetchTicketsForEachEvent();
        // console.log("ticketsMap:" + JSON.stringify(this.ticketsMap));
        // console.log("lowestPrices:" + JSON.stringify(this.lowestPrices)); // Check if lowest prices are stored
      });
  }

  fetchTicketsForEachEvent() {
    this.items$.forEach((event: any) => {
      this.service.getTicketsForEvent(event.id).subscribe((res: any) => {
        this.ticketsMap[event.id] = res;
        // console.log("res:" + JSON.stringify(res));

        // Finds the lowest price for the current event
        const lowestPrice = res.reduce((minPrice: number, ticket: any) => {
          return ticket.price < minPrice ? ticket.price : minPrice;
        }, Infinity);

        // Stores the lowest price for the current event in the lowestPrices object
        this.lowestPrices[event.id] = lowestPrice;
        // console.log("lowestPrice for event " + event.id + ": " + lowestPrice);
      });
    });
  }
  getLowestPrice(eventId: string): number | undefined {
    return this.lowestPrices[eventId];
  }
  // TODO: zabezpieczenie, co jak nie wykona się jedna z metod?
  followEvent(eventId: string){
    if(this.userId && eventId)
    {
      this.service.addUserLikeOrFollower(this.userId, eventId, 'followedEvents').subscribe(
        (response) => {
          //   Toast message
          console.log("Event added to followed");
        },
        (error) => {
          throw error;
        }
      );
      this.service.addEventLikeOrFollower(eventId, this.userId, 'follow').subscribe(
        (response) => {
          //   Toast message
          console.log("Event added to liked");
        },
        (error) => {
          throw error;
        }
      );
    }
    else{
      console.log("Missing userId or eventId");
    }
  }
}
