import {Component, Inject } from '@angular/core';
import {MAT_SNACK_BAR_DATA, MatSnackBar, MatSnackBarConfig} from '@angular/material/snack-bar';

@Component({
  selector: 'app-snackbar',
  templateUrl: '../shared/notification.html',
  styles: [`.success {
      color: lawngreen;
      width: 100%;
      text-align: center;
      display: inline-block;
  }

  .error {
      color: red;
      width: 100%;
      text-align: center;
      display: inline-block;
  }`],
})
export class NotificationComponent {
  constructor(public snackBar: MatSnackBar,
              @Inject(MAT_SNACK_BAR_DATA) public data: any) {
  }



}

