import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PanelManagerService {

  constructor() { }

  activeEventsVisible: boolean = false;
  reportsVisible: boolean = false;
  eventCreationVisible: boolean = false;
  basicInfoVisible: boolean = false;
  activePanel: string = '';

  showActiveEvents() {
    this.resetVisibility();
    this.activeEventsVisible = true;
    this.activePanel = 'activeEvents';
  }

  showReports() {
    this.resetVisibility();
    this.reportsVisible = true;
    this.activePanel = 'reports';
  }

  showEventCreation() {
    this.resetVisibility();
    this.eventCreationVisible = true;
    this.activePanel = 'eventCreation';
    this.basicInfoVisible = true;
  }

  private resetVisibility() {
    this.activeEventsVisible = false;
    this.reportsVisible = false;
    this.eventCreationVisible = false;
  }
}
