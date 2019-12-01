import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {AccountsService} from '../services/accounts.service';
import {Schedule} from '../dto/Schedule';
import {Account} from '../dto/Account';
import {createAccountForm} from '../shared/AccountValues';
import {validateAccountForm} from '../shared/FormValidation';

@Component({
  selector: 'app-edit-account',
  templateUrl: './edit-account.component.html',
  styleUrls: ['../accounts/accounts.component.css']
})
export class EditAccountComponent implements OnInit {

  id: number;
  @ViewChild('fform', {static: false}) accountFormDirective;
  accountForm: FormGroup;
  account: Account;
  schedules: Schedule[] = [];
  formErrors = {
    name: '',
    currentBalance: '',
    statementBalance: '',
    monthlySpend: '',
    scheduleId: ''
  };
  constructor(private accountsService: AccountsService,
              private fb: FormBuilder,
              public dialogRef: MatDialogRef<EditAccountComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.id = data.id;
    this.schedules = data.schedules;
    createAccountForm(this);
  }

  ngOnInit() {
    this.accountsService.getAccount(this.id).subscribe((account) => {
      this.accountForm.patchValue({
        name: account.name,
        scheduleId: account.scheduleId,
        currentBalance: account.currentBalance,
        statementBalance: account.statementBalance,
        monthlySpend: account.monthlySpend
      });
    });
  }
  onSubmit() {
    this.account = this.accountForm.value;
    this.account.id = this.id;
    this.accountsService.putAccount(this.account).subscribe((account) => {
      this.dialogRef.close({message: 'Account updated', isError: false, account: account});
      }, error => {
        this.dialogRef.close({message: error, isError: true});
    });
    this.accountForm.disable();
  }

  onValueChanged(data?: any) {
    validateAccountForm(this, data);
  }
}
