import {FormControl, Validators} from '@angular/forms';

export function  createAccountForm(accountsClass: any) {
  accountsClass.accountForm = accountsClass.fb.group({
    name: new FormControl('', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(25)])),
    accountType: new FormControl('CREDIT_CARD'),
    currentBalance: new FormControl('0', Validators.compose([Validators.min(0), Validators.pattern('^[0-9]*$')])),
    statementBalance: new FormControl('0', Validators.compose([Validators.min(0), Validators.pattern('^[0-9]*$')])),
    monthlySpend: new FormControl('0', Validators.compose([Validators.min(0), Validators.pattern('^[0-9]*$')])),
    scheduleId: new FormControl(''),
  });
  accountsClass.accountForm.valueChanges
    .subscribe(data => accountsClass.onValueChanged(data));
}
