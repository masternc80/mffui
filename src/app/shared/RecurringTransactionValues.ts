import {FormControl, Validators} from '@angular/forms';
import {validatorField} from './FormValidation';
import {Schedule} from '../dto/Schedule';

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
    name: new FormControl('', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(25)])),
    amount: new FormControl(null,
      Validators.compose([
        Validators.required,
        Validators.pattern('^[\-]{0,1}[0-9]+[\.]{0,1}[0-9]{0,2}$')
      ]))
  });
  transactionClass.transactionForm.valueChanges
    .subscribe(data => transactionClass.onValueChanged(data));
}

export function populateSchedules(transactionClass: any, schedules: Schedule[]) {
  transactionClass.schedules = schedules;
  for (const schedule of schedules) {
    const key = 'schedule_' + schedule.id;
    transactionClass.transactionForm.addControl(key, new FormControl(false, Validators.requiredTrue));
    transactionClass.formErrors[key] = '';
  }
}
