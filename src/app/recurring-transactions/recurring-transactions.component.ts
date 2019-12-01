import {Component, OnInit, ViewChild} from '@angular/core';
import {RecurringTransaction} from '../dto/RecurringTransaction';
import {Schedule} from '../dto/Schedule';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ScheduleService} from '../services/schedule.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialog} from '@angular/material/dialog';
import {RecurringTransactionService} from '../services/recurring-transaction.service';
import {createTransactionsForm} from '../shared/RecurringTransactionValues';
import {validateScheduleForm} from '../shared/FormValidation';
import {findSchedule} from '../shared/ScheduleValues';

@Component({
  selector: 'app-recurring-transactions',
  templateUrl: './recurring-transactions.component.html',
  styleUrls: ['./recurring-transactions.component.css']
})
export class RecurringTransactionsComponent implements OnInit {

  schedules: Schedule[] = [];
  durationInSeconds = 2;
  @ViewChild('fform', {static: false}) accountFormDirective;
  transaction: RecurringTransaction;
  transactions: RecurringTransaction[];
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
      if (this.transactions.length > 0) {
        this.populateHint();
      }
    });
  }
  populateHint() {
    this.transactions.forEach((transaction) => {
      transaction['hint'] = '' + transaction.amount +
        '\nSchedules: ' + transaction.scheduleIds.map((id) => findSchedule(id).name).join(', ');
    });
  }
  onValueChanged(data?: any) {
    validateScheduleForm(this, data);
  }
}
