import {Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import {AuthService} from "../../services/auth.service";
import {ActivatedRoute, Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {SnackbarComponent} from "../snackbars/snackbar-error/snackbar.component";
import {SnackbarSuccessComponent} from "../snackbars/snackbar-success/snackbar-success.component";

@Component({
  selector: 'app-organizer-overview-page',
  templateUrl: './organizer-overview-page.component.html',
  styleUrls: ['./organizer-overview-page.component.css'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms', style({ opacity: 1 })),
      ]),
    ]),
  ],
})
export class OrganizerOverviewPageComponent implements OnInit{
  selectedFeature: string = 'Twórz';
  incorrectCredentials = false;
  inSignUpCorrectCredentials = false;
  isFormSubmitted: boolean = false;

  signInCredentials = {
    login: '',
    password: ''
  };

  signUpCredentials = {
    name: '',
    email: '',
    password: '',
    role: 'organizer',
    isOrganizer: 'true',
    ownedEvents: []
  };

  @ViewChild('rePasswordInput') rePasswordInput: any;
  rePassword = '';
  isSignUpFormSubmitted = false;

  features = [
    { title: 'Twórz', description: 'Twórz wydarzenia w wygodnym interfejsie dostępnym po zalogowaniu na konto organizatora, ' +
        'personalizuj bilety, informacje o wydarzeniach i dodawaj artystów, którzy wezmą udział w Twoim wydarzeniu.' },
    { title: 'Zarządzaj', description: 'Panel organizatora umożliwi Ci podgląd aktualnie aktywnych wydarzeń, edytuj wydarzenia, twórz nowe oraz śledź sprzedaż swoich biletów' },
    { title: 'Sprzedawaj', description: 'Sprzedawaj bilety na wydarzenia, zarządzaj cenami i monitoruj postęp sprzedaży dzięki wygodnemu interfejsowi dostępnemu w panelu organizatora.' },
    { title: 'Analizuj', description: 'Podejmuj lepsze decyzje biznesowe dzięki wygodnym narzędziom dostepnym\n' +
        '          z poziomu organizatora, które pozwolą Ci na analizę danych sprzedaży i\n' +
        '          preferencji użytkowników.' }
  ];
  constructor(private elementRef: ElementRef,
              private renderer: Renderer2,
              public authService: AuthService,
              private router: Router,
              private route: ActivatedRoute,
              private _snackBar: MatSnackBar) {}
  ngOnInit() {
    this.toggleFeatureDescription(this.selectedFeature);
  }

  // Function to toggle the selected feature description
  toggleFeatureDescription(title: string) {
    this.selectedFeature = title;
  }

  openModal(modalId: string) {
    const modalDiv= document.getElementById(modalId);
      if(modalDiv != null)
      {
        modalDiv.style.display = 'block';
      }
      this.lowerBrightness();
    }
  closeModal(modalId: string) {
    const modalDiv= document.getElementById(modalId);
    if(modalDiv!= null)
    {
      modalDiv.style.display = 'none';
    }
    this.raiseBrightness();
  }

  lowerBrightness() {
    const element = this.elementRef.nativeElement.querySelector('.section-1');
    if (element) {
      this.renderer.addClass(element, 'brightness-70');
    }
  }
  raiseBrightness() {
    const element = this.elementRef.nativeElement.querySelector('.section-1');
    if (element) {
      this.renderer.removeClass(element, 'brightness-70');
    }
  }

//   SignIn
  signIn() {
    if (this.validateForm()) {
      return this.authService.authenticateOrganiser(this.signInCredentials).subscribe(
        (result) => {
          if (!result) {
            this.openSnackBarError("Coś poszło nie tak");
            this.incorrectCredentials = true;
          } else {
            this.signInCredentials = {
              login: '',
              password: ''
            };
            this.router.navigate(['/event-manager']);
            this.openSnackBarSuccess("Pomyślnie zalogowano na konto.");
          }
        },
        (error) => {
          if (error.status === 401 || error.status === 404) {
            this.openSnackBarError("Podano błędny login lub hasło.");
            this.incorrectCredentials = true;
          } else {
            this.openSnackBarError("Wystapił nieznany błąd, spróbuj ponownie");
          }
        }
      );
    }
    return;
  }
  validateForm(): boolean {
    if (!this.signInCredentials.login || !this.signInCredentials.password) {
      this.isFormSubmitted = true;
      return false;
    }
    return true;
  }

  // SignUp
  signUp() {
    this.isSignUpFormSubmitted = true;
    const rePassword = this.rePasswordInput.nativeElement.value;
    const password = this.signUpCredentials.password;

    if (this.isFormInvalid()) {
      // Empty fields
      return;
    } else if (this.signUpCredentials.password !== rePassword) {
      // Password mismatch
      return;
    } else if (!this.isPasswordStrong(password)) {
      // Weak password
      return;
    } else {
      // Form viable, create user
      this.create();
    }
  }

  create() {
    this.authService.createOrUpdate(this.signUpCredentials).subscribe((result) => {
        window.location.reload();
        this.openSnackBarSuccess("Pomyślnie utworzono konto.");
        return result;
      },
      (error) => {
        if (error.status === 400) {
          this.openSnackBarError("Podany email lub login został już zajęty");
          this.inSignUpCorrectCredentials = true;
        } else {
          console.error(error);
        }
      });
  }
  isFormInvalid() {
    return (
      !this.signUpCredentials.name ||
      !this.signUpCredentials.email ||
      !this.signUpCredentials.password
    );
  }

  isPasswordStrong(password: string): boolean {
    const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{5,15}$/;
    return strongRegex.test(password);
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

  goToOrganizerPanel() {
    this.router.navigate(['/event-manager']);
  }
}
