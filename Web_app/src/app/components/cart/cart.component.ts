import {Component, HostListener, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {DataService} from "../../services/data.service";
import {AuthService} from "../../services/auth.service";
import {tick} from "@angular/core/testing";

@Component({
  selector: 'cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit{
  screenSize: number;
  public userId: string = '';
  cartData: any;
  isCartDataEmpty: boolean = true;

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.screenSize = window.innerWidth;
  }

  constructor(private route: ActivatedRoute, private service: DataService, private authService: AuthService) {
    this.screenSize = window.innerWidth;
  }

  ngOnInit() {
    if(this.authService.isLoggedIn()){
      this.userId = this.authService.getUserId();
      this.getCartItems(); // Call the method to fetch cart items from the server
    }
  }

  getCartItems() {
    this.service.getCart(this.userId).subscribe(
      (cartData: any) => {
        this.cartData = cartData; // Assign the fetched cart data to the cartData variable
        // console.log("JSON.stringify(this.cartData)"+JSON.stringify(this.cartData.cart))
        if(this.cartData.cart.length>0){
          // console.log("is cart false")
          this.isCartDataEmpty = false;
        }
        else{
          // console.log("is cart true")
          this.isCartDataEmpty = true;
        }
        // console.log("cartData: "+JSON.stringify(this.cartData))
      },
      (error: any) => {
        console.error('Error fetching cart data:', error);
      }
    );
  }
  // TODO: takie same użycie tych samych funkcji w sidebarze, do zmiany
  incrementQuantity(userId: string, eventId: string, ticketId: string) {
    this.service.addTicketToCart(userId, eventId, ticketId).subscribe(
      (response) => {
        this.getCartItems();
      },
      (error) => {
        throw error;
      }
    );
  }

  decrementQuantity(userId: string, eventId: string, ticketId: string) {
    this.service.removeTicketFromCart(userId, eventId, ticketId, 1).subscribe(
      (response) => {
        this.getCartItems();
      },
      (error) => {
        throw error;
      }
    );
  }

  removeWholeTicket(userId: string, eventId: string, ticketId: string, quantity: number) {
    this.service.removeTicketFromCart(userId, eventId, ticketId, quantity).subscribe(
      (response) => {
        this.getCartItems();
      },
      (error) => {
        throw error;
      }
    );
  }

  getTotalSum(): number {
    // Calculate the total sum by iterating through the cart items and summing up the item totals
    let totalSum = 0;
    if (this.cartData && this.cartData.cart) {
      for (const cartItem of this.cartData.cart) {
        for (const ticket of cartItem.tickets) {
          totalSum += ticket.quantity * ticket.price;
        }
      }
    }
    return totalSum;
  }

  protected readonly tick = tick;
}
