import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class OrganizerAuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {
  }

  canActivate(): boolean {
    // Checks if the user is logged in as an organizer
    if (this.authService.isLoggedIn() && this.authService.isOrganizer()) {
      return true;
    } else {
      // Redirect unauthorized users
      this.router.navigateByUrl('/');
      return false;
    }
  }
}
