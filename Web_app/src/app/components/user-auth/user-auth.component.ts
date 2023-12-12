import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {SnackbarComponent} from "../snackbars/snackbar-error/snackbar.component";
import {SnackbarSuccessComponent} from "../snackbars/snackbar-success/snackbar-success.component";

@Component({
  selector: 'user-auth',
  templateUrl: './user-auth.component.html',
  styleUrls: ['./user-auth.component.css']
})
export class UserAuthComponent implements OnInit{
  isRightPanelActive = false;
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
  };

  @ViewChild('rePasswordInput') rePasswordInput: any;
  rePassword = '';
  isSignUpFormSubmitted = false;

  constructor(
    public authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const register = params['register'];
      if (register === 'true') {
        this.toggleRightPanel();
      }
    });
  }

  //Sign in
  validateForm(): boolean {
    if (!this.signInCredentials.login || !this.signInCredentials.password) {
      this.isFormSubmitted = true;
      return false;
    }
    return true;
  }

  signIn() {
    if (this.validateForm()) {
      return this.authService.authenticate(this.signInCredentials).subscribe(
        (result) => {
          if (!result) {
            this.openSnackBarError("Coś poszło nie tak");
            this.incorrectCredentials = true;
          } else {
            this.signInCredentials = {
              login: '',
              password: ''
            };
            this.router.navigate(['/']);
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

  // Sign Up
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
        this.router.navigate(['/']);
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

  // Toggle Panel
  toggleRightPanel() {
    this.isRightPanelActive = !this.isRightPanelActive;
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
