import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {DataService} from "../../services/data.service";
import {AuthService} from "../../services/auth.service";
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
