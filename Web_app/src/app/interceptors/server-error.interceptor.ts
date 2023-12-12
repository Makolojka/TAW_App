import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpErrorResponse
} from '@angular/common/http';
import {catchError, Observable, throwError} from 'rxjs';
import {MatSnackBar} from "@angular/material/snack-bar";
import {SnackbarComponent} from "../components/snackbars/snackbar-error/snackbar.component";

@Injectable()
export class ServerErrorInterceptor implements HttpInterceptor {

  constructor(private snackBar: MatSnackBar) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 0) {
          this.openSnackBar("Serwer jest nieosiągalny lub wystąpił problem z serwerem.");
        }
        return throwError(error);
      })
    );
  }

  openSnackBar(errorMsg: string) {
    this.snackBar.openFromComponent(SnackbarComponent, {
      duration: 5000,
      data: { errorMsg: errorMsg },
      panelClass: ['snackbar-error-style']
    });
  }
}
