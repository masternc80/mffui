import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {AccountsService} from '../services/accounts.service';
import {ScheduleService} from '../services/schedule.service';
import {Schedule} from '../dto/Schedule';
import {Account} from '../dto/Account';
import {NotificationComponent} from '../shared/notification.component';
import {EditAccountComponent} from '../edit-account/edit-account.component';
import {createAccountForm} from '../shared/AccountValues';
import {validateAccountForm, validateScheduleForm} from '../shared/FormValidation';
import {MatSnackBar, MatSnackBarConfig} from '@angular/material/snack-bar';
import {ConfirmDialogComponent} from '../confirm-dialog/confirm-dialog.component';
import {findSchedule} from '../shared/ScheduleValues';

const initValue = {
  name: '',
  currentBalance: 0,
  statementBalance: 0,
  monthlySpend: 0
};

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css']
})
export class AccountsComponent implements OnInit {

  accounts: Account[] = [];
  schedules: Schedule[] = [];
  durationInSeconds = 2;
  @ViewChild('fform', {static: false}) accountFormDirective;
  account: Account;
  accountForm: FormGroup;
  formErrors = {
    name: '',
    currentBalance: '',
    statementBalance: '',
    monthlySpend: '',
    scheduleId: ''
  };

  constructor(private service: AccountsService,
              private scheduleService: ScheduleService,
              private fb: FormBuilder,
              private snackBar: MatSnackBar,
              public dialog: MatDialog) {
    createAccountForm(this);
  }



  ngOnInit() {
    this.service.getAccounts().subscribe((accounts) => {
      this.accounts = accounts;
      if (this.schedules.length > 0) {
        this.populateHint();
      }
    });
    this.scheduleService.getSchedules().subscribe((schedules) => {
      this.schedules = schedules;
      this.accountForm.patchValue({ scheduleId: schedules[0].id });
      if (this.accounts.length > 0) {
        this.populateHint();
      }
    });
  }

  populateHint() {
    this.accounts.forEach((account) => {
      account['hint'] = '' + account.accountType +
        '\nSchedule: ' + findSchedule(account.scheduleId, this).name +
        '\nMonthly spend: ' + account.monthlySpend;
    });
  }

  onValueChanged(data?: any) {
    validateAccountForm(this, data);
  }

  onSubmit() {
    this.account = this.accountForm.value;
    for (const schedule of this.schedules) {
      if (this.accountForm.get('scheduleId').value == schedule.id) {
        this.account.schedule = schedule;
        break;
      }
    }
    this.account.scheduleId = this.account.schedule.id;
    this.service.postAccount(this.account).subscribe((account) => this.accounts.push(account),
      errMsg => this.openSnackBar(errMsg, true));
    this.accountFormDirective.resetForm(initValue);
    this.account = null;
  }

  deleteAccount(id: number) {
    let curAccount: Account;
    for (let i = 0; i < this.accounts.length; i++) {
      if (this.accounts[i].id === id) {
        curAccount = this.accounts[i];
        break;
      }
    }
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        message: 'Delete account \'' + curAccount.name + '\'?'
      }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result === 'Ok') {
        this.service.deleteAccount(id).subscribe((status) => {
          if (status.status === 'OK') {
            for (let i = 0; i < this.accounts.length; i++) {
              if (this.accounts[i].id === id) {
                this.accounts.splice(i, 1);
                this.openSnackBar('Account deleted', false);
                break;
              }
            }
          } else {
            this.openSnackBar(status.status, true);
            console.log(status.status);
          }
        }, errMess => {
          this.openSnackBar(errMess, true);
          console.log(errMess);
        });
      }});
  }

  editAccount(id: number) {
    const dialogRef = this.dialog.open(EditAccountComponent, {width: '348px', data: {id: id, schedules: this.schedules}});
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.openSnackBar(result.message, result.isError);
        if (!result.isError) {
          this.accounts = this.accounts.map(s => s.id === id ? result.account : s);
        }
      }
    });
  }
  openSnackBar(message: string, isError: boolean) {
    const config = new MatSnackBarConfig();
    config.data = {message: message, class: (isError ? 'error' : 'success')};
    config.duration = this.durationInSeconds * 1000;
    this.snackBar.openFromComponent(NotificationComponent, config);
  }
}
