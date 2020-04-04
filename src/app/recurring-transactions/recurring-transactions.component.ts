import {Component, OnInit, ViewChild} from '@angular/core';
import {RecurringTransaction} from '../dto/RecurringTransaction';
import {Schedule} from '../dto/Schedule';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ScheduleService} from '../services/schedule.service';
import {MatSnackBar, MatSnackBarConfig} from '@angular/material/snack-bar';
import {MatDialog} from '@angular/material/dialog';
import {RecurringTransactionService} from '../services/recurring-transaction.service';
import {createTransactionsForm} from '../shared/RecurringTransactionValues';
import {validateTransactionsForm} from '../shared/FormValidation';
import {findSchedule} from '../shared/ScheduleValues';
import {NotificationComponent} from '../shared/notification.component';
import {Account} from '../dto/Account';
import {ConfirmDialogComponent} from '../confirm-dialog/confirm-dialog.component';
import {EditScheduleComponent} from '../edit-schedule/edit-schedule.component';
import {EditRecurringTransactionComponent} from '../edit-recurring-transaction/edit-recurring-transaction.component';
import {EditAccountComponent} from '../edit-account/edit-account.component';

const initValue = {
  name: '',
  amount: 0
};
@Component({
  selector: 'app-recurring-transactions',
  templateUrl: './recurring-transactions.component.html',
  styleUrls: ['./recurring-transactions.component.css']
})
export class RecurringTransactionsComponent implements OnInit {

  schedules: Schedule[] = [];
  durationInSeconds = 2;
  @ViewChild('fform', {static: false}) transactionFormDirective;
  transaction: RecurringTransaction;
  transactions: RecurringTransaction[] = [];
  transactionForm: FormGroup;
  formErrors = {
    name: '',
    amount: '',
  };

  constructor(private service: RecurringTransactionService,
              private scheduleService: ScheduleService,
              private fb: FormBuilder,
              private snackBar: MatSnackBar,
              public dialog: MatDialog) {
    createTransactionsForm(this);
  }

  ngOnInit() {
    this.service.getRecurringTransactions().subscribe((transactions) => {
      this.transactions = transactions;
      if (this.schedules.length > 0) {
        this.populateHint();
      }
    });
    this.scheduleService.getSchedules().subscribe((schedules) => {
      this.schedules = schedules;
      this.transactionForm.patchValue({ scheduleId: schedules[0].id });
      for (const schedule of schedules) {
        const key = 'schedule_' + schedule.id;
        this.transactionForm.addControl(key, new FormControl(false, Validators.requiredTrue));
        this.formErrors[key] = '';
      }
      if (this.transactions.length > 0) {
        this.populateHint();
      }
    });
  }
  populateHint() {
    this.transactions.forEach((transaction) => {
      transaction['hint'] = '' + transaction.amount +
        '\nSchedules: ' + transaction.scheduleIds.map((id) => findSchedule(id, this).name).join(', ');
    });
  }
  onValueChanged(data?: any) {
    validateTransactionsForm(this, data);
  }

  editTransaction(id: number) {
    const dialogRef = this.dialog.open(EditRecurringTransactionComponent, {width: '348px', data: {id: id, schedules: this.schedules}});
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.openSnackBar(result.message, result.isError);
        if (!result.isError) {
          this.transactions = this.transactions.map(s => s.id === id ? result.transactions : s);
        }}
    });
  }

  deleteTransaction(id: number) {
    let curTransaction: RecurringTransaction;
    for (let i = 0; i < this.transactions.length; i++) {
      if (this.transactions[i].id === id) {
        curTransaction = this.transactions[i];
        break;
      }
    }
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        message: 'Delete recurring transaction \'' + curTransaction.name + '\'?'
      }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result === 'Ok') {
        this.service.deleteRecurringTransaction(id).subscribe((status) => {
          if (status.status === 'OK') {
            for (let i = 0; i < this.transactions.length; i++) {
              if (this.transactions[i].id === id) {
                this.transactions.splice(i, 1);
                this.openSnackBar('Recurring transaction deleted', false);
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

  onSubmit() {
    this.transaction = this.transactionForm.value;
    this.transaction.scheduleIds = [];
    for (const schedule of this.schedules) {
      if (this.transactionForm.get('schedule_' + schedule.id).value === true) {
        this.transaction.scheduleIds.push(schedule.id);
      }
    }
    this.service.postRecurringTransaction(this.transaction).subscribe(
      transaction => this.transactions.push(transaction),
      errMsg => this.openSnackBar(errMsg, true));
    this.transactionFormDirective.resetForm(initValue);
    this.transaction = null;
  }

  openSnackBar(message: string, isError: boolean) {
    const config = new MatSnackBarConfig();
    config.data = {message: message, class: (isError ? 'error' : 'success')};
    config.duration = this.durationInSeconds * 1000;
    this.snackBar.openFromComponent(NotificationComponent, config);
  }
}
