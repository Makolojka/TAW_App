import { UserAuthComponent } from '../components/user-auth/user-auth.component';
import {AuthService} from "../services/auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ActivatedRoute, Router} from "@angular/router";
import {of} from "rxjs";
describe('UserAuthTests:', () => {
  let component: UserAuthComponent;
  let authService: AuthService;
  let snackBar: MatSnackBar;
  let router: Router;
  let activatedRoute: ActivatedRoute;

  beforeEach(() => {
    authService = jasmine.createSpyObj('AuthService', ['authenticate', 'otherMethodsIfAny']);
    authService.createOrUpdate = jasmine.createSpy().and.returnValue(of(true));
    snackBar = jasmine.createSpyObj('MatSnackBar', ['openFromComponent', 'openSnackBarError', 'openSnackBarSuccess']);
    router = jasmine.createSpyObj('Router', ['navigate']);
    activatedRoute = {} as ActivatedRoute;
    component = new UserAuthComponent(authService, router, activatedRoute, snackBar);
  });

  describe('UserAuthComponent Validation Methods', () => {
    it('should return false when sign-in form is invalid', () => {
      component.signInCredentials.login = '';
      component.signInCredentials.password = '';

      const isValid = component.validateForm();

      expect(isValid).toBe(false);
      expect(component.isFormSubmitted).toBe(true);
    });

    it('should return true when sign-in form is valid', () => {
      component.signInCredentials.login = 'Test account';
      component.signInCredentials.password = 'test@gmail.com';

      const isValid = component.validateForm();

      expect(isValid).toBe(true);
      expect(component.isFormSubmitted).toBe(false);
    });

    it('should return false when sign-in form is partially invalid', () => {
      component.signInCredentials.login = 'Test account';
      component.signInCredentials.password = '';

      const isValid = component.validateForm();

      expect(isValid).toBe(false);
      expect(component.isFormSubmitted).toBe(true);
    });

    it('should return true when sign-up form is invalid', () => {
      component.signUpCredentials.name = '';
      component.signUpCredentials.email = '';
      component.signUpCredentials.password = '';

      const isInvalidValid = component.isFormInvalid();

      expect(isInvalidValid).toBe(true);
    });

    it('should return true when sign-up form is partially invalid', () => {
      component.signUpCredentials.name = '';
      component.signUpCredentials.email = 'john@example.com';
      component.signUpCredentials.password = 'StrongPassword123';

      const isInvalidValid = component.isFormInvalid();

      expect(isInvalidValid).toBe(true);
    });

    it('should return false when sign-up form is valid', () => {
      component.signUpCredentials.name = 'John Doe';
      component.signUpCredentials.email = 'john@example.com';
      component.signUpCredentials.password = 'StrongPassword123';

      const isInvalidValid = component.isFormInvalid();

      expect(isInvalidValid).toBe(false);
    });
  });

  describe('UserAuthService', () => {
    it('should return false for too long strong password', () => {
      const longStrongPassword = 'StrongPassword123@!';
      const isValid = component.isPasswordStrong(longStrongPassword);
      expect(isValid).toBe(false);
    });

    it('should return false for a weak password without uppercase letter', () => {
      const weakPassword = 'weakpassword123@';
      const isValid = component.isPasswordStrong(weakPassword);
      expect(isValid).toBe(false);
    });

    it('should return false for a weak password without special characters', () => {
      const weakPassword = 'WeakPassword123';
      const isValid = component.isPasswordStrong(weakPassword);
      expect(isValid).toBe(false);
    });

    it('should return false for a password that is too short', () => {
      const shortPassword = 'S0t!';
      const isValid = component.isPasswordStrong(shortPassword);
      expect(isValid).toBe(false);
    });

    it('should return false for a password that is too long', () => {
      const longPassword = 'ThisIsAVeryLongPassword12345@';
      const isValid = component.isPasswordStrong(longPassword);
      expect(isValid).toBe(false);
    });
  });


  describe('UserAuthComponent', () => {
    it('should handle successful sign-in', () => {
      (authService.authenticate as jasmine.Spy).and.returnValue(of(true));

      component.signInCredentials = {
        login: 'test@example.com',
        password: 'TestPassword123'
      };

      component.signIn();

      expect(router.navigate).toHaveBeenCalledWith(['/']);
    });

    it('should handle authentication failure', () => {
      (authService.authenticate as jasmine.Spy).and.returnValue(of(false));

      component.signInCredentials = {
        login: 'test@example.com',
        password: 'TestPassword123'
      };

      component.signIn();

      expect(snackBar.openFromComponent).toHaveBeenCalled();
      expect(snackBar.openFromComponent).toHaveBeenCalledWith(jasmine.any(Function), {
        duration: 5000,
        data: { errorMsg: 'Coś poszło nie tak' },
        panelClass: ['snackbar-error-style']
      });
    });

    it('should handle authentication failure with invalid credentials', () => {
      (authService.authenticate as jasmine.Spy).and.returnValue(of(false));

      component.signInCredentials = {
        login: '',
        password: ''
      };

      component.signIn();

      expect(snackBar.openFromComponent).toHaveBeenCalled();
    });

    it('should create user if the form is valid', () => {
      component.signUpCredentials = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'zaq123!@K'
      };
      component.rePasswordInput = {
        nativeElement: {
          value: 'zaq123!@K'
        }
      };

      spyOn(component, 'create').and.callThrough();

      component.signUp();
      expect(component.create).toHaveBeenCalled();
    });

    it('should not create user if the form is invalid', () => {
      component.signUpCredentials = {
        name: 'John Doe',
        email: '',
        password: 'zaq123!@K'
      };
      component.rePasswordInput = {
        nativeElement: {
          value: 'zaq123'
        }
      };

      spyOn(component, 'create').and.callThrough();

      component.signUp();
      expect(component.create).not.toHaveBeenCalled();
    });

  });
});
