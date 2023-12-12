import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {PanelManagerService} from "../../services/panel-manager.service";

@Component({
  selector: 'app-event-manager',
  templateUrl: './event-manager.component.html',
  styleUrls: ['./event-manager.component.css']
})
export class EventManagerComponent implements OnInit{

  // Temporary img
  public imageMissing: string = '././assets/img/sopot.jpg';

  // Dynamic logic - main objects
  public userId: string = '';

  constructor(private authService: AuthService, public panelManagerService: PanelManagerService) {}

  ngOnInit() {
    this.panelManagerService.activeEventsVisible = true;
    this.userId = this.authService.getUserId();
  }

  // TODO: Tylko do testu - usunąć później
  // addEventTOP(){
  //   this.service.addEventToOwnedEvents(this.userId, '64c7d625d0be393eb01912f6').subscribe(
  //     (response) => {
  //       console.log("Event added to ownedEvents");
  //     },
  //     (error) => {
  //       throw error;
  //     }
  //   );
  //
  // }

  protected readonly open = open;
}
