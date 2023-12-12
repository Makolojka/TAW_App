import {Component, Inject, Input} from '@angular/core';
import {MAT_SNACK_BAR_DATA, MatSnackBarRef} from "@angular/material/snack-bar";
import {SnackbarComponent} from "../snackbar-error/snackbar.component";

@Component({
  selector: 'app-snackbar-success',
  templateUrl: './snackbar-success.component.html',
  styleUrls: ['./snackbar-success.component.css']
})
export class SnackbarSuccessComponent {
  @Input() msg: any;

  constructor(
    public snackBarRef: MatSnackBarRef<SnackbarComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public data: any
  ) {
    if (data) {
      this.msg = data.msg;
    }
  }
}
