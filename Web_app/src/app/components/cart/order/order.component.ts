import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {DataService} from "../../../services/data.service";
import {AuthService} from "../../../services/auth.service";
import {OrderDataService} from "../../../services/order-data.service";
import {SnackbarSuccessComponent} from "../../snackbars/snackbar-success/snackbar-success.component";
import {SnackbarComponent} from "../../snackbars/snackbar-error/snackbar.component";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit{
  // User and cart data
  userId: string = '';
  cartData: any;
  validOrder: boolean = false;
  user = {
    name: '',
    email: '',
  };

  // Transaction data
  transactionData: any = {};

  constructor(private router: Router,
              private service: DataService,
              private orderDataService: OrderDataService,
              private _snackBar: MatSnackBar,
              private authService: AuthService) {
  }

  ngOnInit() {
    if(this.orderDataService.userId !== '' || this.orderDataService.cartData.length !== 0)
    {
      this.validOrder = true;
    }

    this.userId = this.orderDataService.userId;
    this.cartData = this.orderDataService.cartData;
    this.getUserDetails();
  }

  getUserDetails(){
    const currentUser = this.authService.currentUser;
    if (currentUser) {
      console.log("currentUser:", currentUser)
      this.user.name = currentUser.name;
      this.user.email = currentUser.email;
    }
  }

  getTotalSum(): number {
    // Calculate the total sum by iterating through the cart items
    let totalSum = 0;
    if (this.cartData && this.cartData.cart) {
      for (const cartItem of this.cartData.cart) {
        for (const ticket of cartItem.tickets) {
          totalSum += ticket.quantity * ticket.price;
        }
      }
    }
    return Number(totalSum.toFixed(2));
  }

  prepareTransactionData(): any {
    const ticketsArray = [];
    if (this.cartData && this.cartData.cart) {
      for (const cartItem of this.cartData.cart) {
        for (const ticket of cartItem.tickets) {
          ticketsArray.push({
            ticketId: ticket._id,
            eventId: cartItem.event._id,
            count: ticket.quantity,
            singleTicketCost: ticket.price,
            seatNumbers: ticket.seatNumbers
          });
        }
      }
    }

    const totalCost = this.getTotalSum();
    this.transactionData = {
      userId: this.userId,
      tickets: ticketsArray,
      totalCost: totalCost
    };

    console.log("Transaction data: ", this.transactionData);
  }

  buyTickets() {
    this.prepareTransactionData();
    this.service.processTransaction(this.transactionData).subscribe(
      (response) => {
        this.router.navigate(['/cart']);
        this.openSnackBarSuccess("Kupiono bilety.");
      },
      (error) => {
        this.router.navigate(['/cart']);
        this.openSnackBarError("Coś poszło nie tak: " + error);
      }
    );
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

}
