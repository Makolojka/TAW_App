import {Component, OnInit} from '@angular/core';
import {ViewportScroller} from "@angular/common";
import {ActivatedRoute} from "@angular/router";
import {DataService} from "../../services/data.service";
import {AuthService} from "../../services/auth.service";
import {Ticket} from "../event-card/Ticket";
import {Artist} from "../../interfaces/artist";
@Component({
  selector: 'liked',
  templateUrl: './liked.component.html',
  styleUrls: ['./liked.component.css']
})
export class LikedComponent implements OnInit{
  private userId: string = '';
  public items$: any;
  public isItemsEmpty: boolean = false;

  constructor(private route: ActivatedRoute, private service: DataService, private authService: AuthService) {}

  ngOnInit(){
    this.userId = this.authService.getUserId();
    this.service.getUserLikedOrFollowedEvents(this.userId, 'like').subscribe((response) => {
      this.items$ = response;
      // console.log("this.items$.length"+this.items$.length)
      if(this.items$.length>0){
        this.isItemsEmpty = false;
      }
      else{
        this.isItemsEmpty = true;
      }
    });
  }

  // TODO: zabezpieczenie, co jak nie wykona się jedna z metod?
  likeEvent(eventId: string){
    // console.log("this.userId: "+this.userId+"  this.id: "+eventId+" for likedEvents")
    if(this.userId && eventId)
    {
      this.service.addUserLikeOrFollower(this.userId, eventId, 'likedEvents').subscribe(
        (response) => {
          //   Toast message
          console.log("Event added to liked in user");
        },
        (error) => {
          throw error;
        }
      );
      this.service.addEventLikeOrFollower(eventId, this.userId, 'like').subscribe(
        (response) => {
          //   Toast message
          console.log("Event added to liked in event");
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
