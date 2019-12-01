import {FormControl, Validators} from '@angular/forms';
import {validatorField} from './FormValidation';

export const initValue = {
  name: '',
  isPeriodic: null,
  periodLength: '',
  periodUnit: 'DAY',
  startDate: '',
  baseDayOfMonth: null,
  isPriorWeekend: false
};

export function createTransactionsForm(transactionClass: any) {
  transactionClass.transactionForm = transactionClass.fb.group({
    name: new FormControl('', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(25)])),
    amount: new FormControl(null,
      Validators.compose([
        Validators.pattern('^[\-]{0,1}[0-9]+[\.]{0,1}[0-9]{1,2}$')
      ]))
  });
  transactionClass.transactionForm.valueChanges
    .subscribe(data => transactionClass.onValueChanged(data));
}
