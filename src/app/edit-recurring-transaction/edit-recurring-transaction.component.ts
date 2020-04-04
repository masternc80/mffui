import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {RecurringTransaction} from '../dto/RecurringTransaction';
import {Schedule} from '../dto/Schedule';
import {createTransactionsForm, populateSchedules} from '../shared/RecurringTransactionValues';
import {validateTransactionsForm} from '../shared/FormValidation';
import {RecurringTransactionService} from '../services/recurring-transaction.service';

@Component({
  selector: 'app-edit-recurring-transaction',
  templateUrl: './edit-recurring-transaction.component.html',
  styleUrls: ['../recurring-transactions/recurring-transactions.component.css']
})
export class EditRecurringTransactionComponent implements OnInit {

  id: number;
  schedules: Schedule[] = [];
  @ViewChild('fform', {static: false}) transactionFormDirective;
  transaction: RecurringTransaction;
  transactionForm: FormGroup;
  formErrors = {
    name: '',
    amount: '',
  };

  constructor(private service: RecurringTransactionService,
              private fb: FormBuilder,
              public dialogRef: MatDialogRef<EditRecurringTransactionComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.id = data.id;
    createTransactionsForm(this);
    populateSchedules(this, data.schedules);
  }

  ngOnInit() {
    this.service.getRecurringTransaction(this.id).subscribe((transaction) => {
      this.transactionForm.patchValue({
        name: transaction.name,
        amount: transaction.amount
      });
      for (const schedule of this.schedules) {
        for (const scheduleId of transaction.scheduleIds) {
          if (scheduleId === schedule.id) {
            const key = 'schedule_' + schedule.id;
            const val = {};
            val[key] = true;
            this.transactionForm.patchValue(val);
          }
        }
      }
    });
  }

  onValueChanged(data?: any) {
    validateTransactionsForm(this, data);
  }

  onSubmit() {
    this.transaction = this.transactionForm.value;
    this.transaction.scheduleIds = [];
    for (const schedule of this.schedules) {
      if (this.transactionForm.get('schedule_' + schedule.id).value === true) {
        this.transaction.scheduleIds.push(schedule.id);
      }
    }
    this.service.putRecurringTransaction(this.transaction).subscribe((transaction) => {
      this.dialogRef.close({message: 'Account updated', isError: false, transaction: transaction});
    }, error => {
      this.dialogRef.close({message: error, isError: true});
    });
    this.transactionForm.disable();
  }
}
