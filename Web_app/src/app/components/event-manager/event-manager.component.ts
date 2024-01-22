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

  protected readonly open = open;
}
