import {Component, HostListener, Input} from '@angular/core';

@Component({
  selector: 'main-button',
  template: `
    <button [class]="buttonClass">
      <span *ngIf="icon" class="button-icon">
        <i class="fa {{ icon }} icon"></i>
      </span>
      <span *ngIf="!isMobile">{{ text }}</span>
    </button>
  `,
  styleUrls: ['./main-button.component.css'],
})
export class MainButtonComponent {
  @Input() text: string;
  @Input() buttonClass: string;
  @Input() icon: string;
  isMobile: boolean = false;

  constructor() {
    this.text = '';
    this.buttonClass = '';
    this.icon = '';
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenSize();
  }

  checkScreenSize() {
    this.isMobile = window.innerWidth <= 768;
  }
}
